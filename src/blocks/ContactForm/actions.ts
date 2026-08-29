'use server'

import { Resend } from 'resend'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { internalNotificationEmail, customerConfirmationEmail } from './emails'

export type ContactFormState = { status: 'idle' | 'success' | 'error'; message?: string }

async function verifyTurnstile(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  // Not configured yet in this environment — don't block submissions before
  // the site owner has finished captcha setup.
  if (!secret) return true
  if (!token) return false

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  })
  const data = await res.json()
  return Boolean(data.success)
}

export async function submitContactForm(
  formType: 'quote' | 'contact' | 'storeSignup',
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    const verified = await verifyTurnstile(String(formData.get('cf-turnstile-response') || ''))
    if (!verified) {
      return { status: 'error', message: 'Captcha verification failed. Please try again.' }
    }

    const usesFirstLast = formType === 'quote' || formType === 'storeSignup'
    const firstName = String(formData.get('firstName') || '')
    const lastName = String(formData.get('lastName') || '')
    const name = usesFirstLast ? `${firstName} ${lastName}`.trim() : String(formData.get('name') || '')
    const email = String(formData.get('email') || '')
    const phone = String(formData.get('phone') || '')
    const organization = String(formData.get('organization') || '')
    const productInterest = String(formData.get('productInterest') || '')
    const productColor = String(formData.get('productColor') || '')
    const quantity = String(formData.get('quantity') || '')
    const inHandsDate = String(formData.get('inHandsDate') || '')
    const businessName = String(formData.get('businessName') || '')
    const storePlatform = String(formData.get('storePlatform') || '')
    const message = String(formData.get('message') || '')

    const missingRequired =
      formType === 'quote'
        ? !firstName || !lastName || !email || !phone
        : formType === 'storeSignup'
          ? !firstName || !lastName || !email || !businessName
          : !name || !email

    if (missingRequired) {
      return { status: 'error', message: 'Please fill in the required fields.' }
    }

    const payload = await getCachedPayload()

    const logoFiles = formData.getAll('logos').filter((f): f is File => f instanceof File && f.size > 0)
    const logoMediaIds: number[] = []
    const attachments: { filename: string; content: Buffer }[] = []

    for (const file of logoFiles) {
      const buffer = Buffer.from(await file.arrayBuffer())
      attachments.push({ filename: file.name, content: buffer })
      const upload = await payload.create({
        collection: 'logo-uploads',
        data: {},
        file: { data: buffer, mimetype: file.type || 'application/octet-stream', name: file.name, size: file.size },
      })
      logoMediaIds.push(upload.id)
    }

    await payload.create({
      collection: 'form-submissions',
      data: {
        formType,
        name: name || email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email,
        phone,
        organization,
        productInterest,
        productColor,
        quantity,
        inHandsDate: inHandsDate || undefined,
        businessName: businessName || undefined,
        storePlatform: (storePlatform || undefined) as 'basic' | 'pro' | undefined,
        logos: logoMediaIds.map((id) => ({ file: id })),
        message,
      },
    })

    // Email sending is best-effort — the submission is already safely
    // stored above, so a mail failure shouldn't block the success message.
    // The internal and customer emails are sent independently: earlier this
    // was one try/catch, so an attachment issue on the internal email (only
    // quote submissions carry logo attachments) silently skipped the
    // customer confirmation too.
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const fromAddress = process.env.RESEND_FROM_EMAIL || 'Kocreators <onboarding@resend.dev>'

      const submission = {
        formType,
        name,
        firstName,
        lastName,
        email,
        phone,
        organization,
        productInterest,
        productColor,
        quantity,
        inHandsDate,
        businessName,
        storePlatform,
        message,
      }

      try {
        const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
        const internalTo = siteSettings?.email
        if (internalTo) {
          await resend.emails.send({
            from: fromAddress,
            to: internalTo,
            replyTo: email,
            subject:
              formType === 'quote'
                ? `New project request — ${name || email}`
                : formType === 'storeSignup'
                  ? `New store signup — ${businessName || name || email}`
                  : `New contact form message — ${name || email}`,
            html: internalNotificationEmail(submission),
            attachments: attachments.length ? attachments : undefined,
          })
        }
      } catch (emailErr) {
        console.error(`Internal notification email failed (formType=${formType}):`, emailErr)
      }

      try {
        await resend.emails.send({
          from: fromAddress,
          to: email,
          subject: 'We got your request — Kocreators',
          html: customerConfirmationEmail(submission),
          attachments: attachments.length ? attachments : undefined,
        })
      } catch (emailErr) {
        console.error(`Customer confirmation email failed (formType=${formType}):`, emailErr)
      }
    }

    return {
      status: 'success',
      message:
        "We've received your request and a member of our team will be in touch within one business day to discuss your project and next steps.",
    }
  } catch (err) {
    console.error('Form submission failed:', err)
    return { status: 'error', message: 'Something went wrong. Please try again or call us directly.' }
  }
}
