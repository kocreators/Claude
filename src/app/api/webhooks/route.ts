import { Resend } from 'resend'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { eventNotificationEmail, parseEvent } from '@/lib/webhooks/events'
import { SIGNATURE_HEADER, TIMESTAMP_HEADER, verifySignature } from '@/lib/webhooks/verify'

// Node runtime: the signature check needs node:crypto. force-dynamic keeps
// the handler out of any static/ISR path.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 1_000_000

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status })
}

async function notificationRecipient(): Promise<string | undefined> {
  if (process.env.WEBHOOK_NOTIFY_EMAIL) return process.env.WEBHOOK_NOTIFY_EMAIL
  try {
    const payload = await getCachedPayload()
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    return siteSettings?.email || undefined
  } catch (err) {
    console.error('Webhook: could not read site-settings for the notification address:', err)
    return undefined
  }
}

export async function POST(req: Request) {
  const secret = process.env.WEBHOOK_SECRET
  if (!secret) {
    console.error('Webhook: WEBHOOK_SECRET is not set — refusing to accept unsigned deliveries.')
    return json({ error: 'Webhook listener is not configured.' }, 500)
  }

  const declaredLength = Number(req.headers.get('content-length') || 0)
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ error: 'Payload too large.' }, 413)
  }

  // The raw text is what gets signed — parse only after verifying, so an
  // unauthenticated request never reaches the JSON parser or the mailer.
  const rawBody = await req.text()
  if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) {
    return json({ error: 'Payload too large.' }, 413)
  }

  const verification = verifySignature({
    secret,
    rawBody,
    signatureHeader: req.headers.get(SIGNATURE_HEADER),
    timestampHeader: req.headers.get(TIMESTAMP_HEADER),
  })
  if (!verification.ok) {
    console.warn(`Webhook: rejected delivery (${verification.reason})`)
    return json({ error: 'Invalid signature.' }, 401)
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return json({ error: 'Body must be valid JSON.' }, 400)
  }

  const parsed = parseEvent(body)
  if (!parsed.ok) {
    return json({ error: parsed.reason }, 400)
  }
  const event = parsed.event

  if (!process.env.RESEND_API_KEY) {
    console.error('Webhook: RESEND_API_KEY is not set — cannot send the notification email.')
    return json({ error: 'Mail transport is not configured.' }, 500)
  }

  const to = await notificationRecipient()
  if (!to) {
    console.error('Webhook: no notification address — set WEBHOOK_NOTIFY_EMAIL or the Site Settings email.')
    return json({ error: 'No notification address configured.' }, 500)
  }

  const { subject, html } = eventNotificationEmail(event)

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Kocreators <onboarding@resend.dev>',
      to,
      subject,
      html,
    })
    if (error) throw error
  } catch (err) {
    // 502 rather than 200: most senders retry on a 5xx, and a dropped
    // notification is the one failure mode this endpoint exists to avoid.
    console.error(`Webhook: notification email failed (type=${event.type}, id=${event.id ?? 'n/a'}):`, err)
    return json({ error: 'Notification email failed.' }, 502)
  }

  console.log(`Webhook: notified ${to} about ${event.type} (id=${event.id ?? 'n/a'})`)
  return json({ received: true, type: event.type, id: event.id ?? null }, 200)
}

export function GET() {
  return json({ error: 'Method not allowed. POST a signed JSON event to this endpoint.' }, 405)
}
