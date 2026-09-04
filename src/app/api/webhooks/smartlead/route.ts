import crypto from 'crypto'
import { Resend } from 'resend'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { eventNotificationEmail } from '@/lib/webhooks/events'
import { notifyEvents, parseSmartleadEvent } from '@/lib/webhooks/smartlead'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 1_000_000

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status })
}

function tokenMatches(provided: string | null, expected: string) {
  if (!provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

async function notificationRecipient(): Promise<string | undefined> {
  if (process.env.WEBHOOK_NOTIFY_EMAIL) return process.env.WEBHOOK_NOTIFY_EMAIL
  try {
    const payload = await getCachedPayload()
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    return siteSettings?.email || undefined
  } catch (err) {
    console.error('Smartlead webhook: could not read site-settings for the notification address:', err)
    return undefined
  }
}

/**
 * Smartlead's webhooks carry no signature — their setup UI exposes no signing
 * secret — so the shared HMAC endpoint at /api/webhooks can't accept them.
 * This route authenticates on a high-entropy token in the query string
 * instead, which is the only channel Smartlead gives us: it sends no custom
 * headers either.
 *
 * Status codes matter more than usual here. Smartlead treats 4xx as a
 * permanent failure and never retries, while 5xx gets retried at 1min, 5min
 * and 30min. So configuration errors (bad token, malformed body) return 4xx,
 * and anything transient — a mail outage — returns 5xx to earn a retry.
 */
export async function POST(req: Request) {
  const expectedToken = process.env.SMARTLEAD_WEBHOOK_TOKEN
  if (!expectedToken) {
    console.error('Smartlead webhook: SMARTLEAD_WEBHOOK_TOKEN is not set — refusing deliveries.')
    return json({ error: 'Smartlead listener is not configured.' }, 500)
  }

  const token = new URL(req.url).searchParams.get('token')
  if (!tokenMatches(token, expectedToken)) {
    console.warn('Smartlead webhook: rejected delivery (bad or missing token)')
    return json({ error: 'Invalid token.' }, 401)
  }

  if (Number(req.headers.get('content-length') || 0) > MAX_BODY_BYTES) {
    return json({ error: 'Payload too large.' }, 413)
  }

  const rawBody = await req.text()
  if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) {
    return json({ error: 'Payload too large.' }, 413)
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return json({ error: 'Body must be valid JSON.' }, 400)
  }

  // Smartlead's own delivery id. Logged so a delivery can be traced back to
  // their dashboard when someone asks why an email did or didn't arrive.
  const requestId = req.headers.get('x-request-id') || undefined

  const parsed = parseSmartleadEvent(body, requestId)
  if (!parsed.ok) {
    console.warn(`Smartlead webhook: rejected delivery (${parsed.reason}, requestId=${requestId ?? 'n/a'})`)
    return json({ error: parsed.reason }, 400)
  }

  const { eventType, event } = parsed

  if (!notifyEvents().includes(eventType)) {
    // Acknowledged, not emailed. Sends and opens fire constantly; only the
    // events worth interrupting someone for reach the inbox.
    console.log(`Smartlead webhook: ignoring ${eventType} (requestId=${requestId ?? 'n/a'})`)
    return json({ received: true, type: eventType, notified: false }, 200)
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('Smartlead webhook: RESEND_API_KEY is not set — cannot send the notification email.')
    return json({ error: 'Mail transport is not configured.' }, 500)
  }

  const to = await notificationRecipient()
  if (!to) {
    console.error('Smartlead webhook: no notification address configured.')
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
    console.error(`Smartlead webhook: email failed (${eventType}, requestId=${requestId ?? 'n/a'}):`, err)
    return json({ error: 'Notification email failed.' }, 502)
  }

  console.log(`Smartlead webhook: notified ${to} about ${eventType} (requestId=${requestId ?? 'n/a'})`)
  return json({ received: true, type: eventType, notified: true }, 200)
}

export function GET() {
  return json({ error: 'Method not allowed. Smartlead must POST JSON to this endpoint.' }, 405)
}
