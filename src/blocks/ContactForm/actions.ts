'use server'

import { getCachedPayload } from '@/lib/getCachedPayload'

export type ContactFormState = { status: 'idle' | 'success' | 'error'; message?: string }

export async function submitContactForm(
  formType: 'quote' | 'contact',
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    const payload = await getCachedPayload()
    await payload.create({
      collection: 'form-submissions',
      data: {
        formType,
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        phone: String(formData.get('phone') || ''),
        organization: String(formData.get('organization') || ''),
        message: String(formData.get('message') || ''),
      },
    })
    return { status: 'success', message: "Thanks — we'll be in touch within one business day." }
  } catch (err) {
    return { status: 'error', message: 'Something went wrong. Please try again or call us directly.' }
  }
}
