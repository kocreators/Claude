// Parsing + email rendering for inbound webhook events. Kept provider-neutral:
// anything that can POST JSON and sign it (Zapier, Make, n8n, a WooCommerce
// plugin, your own scripts) can drive this.

export type WebhookEvent = {
  /** Sender's own event id, if it provides one. Logged so replays are traceable. */
  id?: string
  type: string
  createdAt?: string
  data: Record<string, unknown>
}

export type ParseResult = { ok: true; event: WebhookEvent } | { ok: false; reason: string }

function asString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export function parseEvent(payload: unknown): ParseResult {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, reason: 'body must be a JSON object' }
  }

  const body = payload as Record<string, unknown>
  // `type` is the canonical field; `event` is accepted because several
  // no-code senders name it that way and can't easily rename it.
  const type = asString(body.type) || asString(body.event)
  if (!type) return { ok: false, reason: 'missing "type" (or "event") field' }

  const rawData = body.data
  const data =
    rawData && typeof rawData === 'object' && !Array.isArray(rawData)
      ? (rawData as Record<string, unknown>)
      : // No `data` envelope? Treat the whole body as the payload, minus the
        // envelope fields, so flat senders still produce a useful email.
        Object.fromEntries(Object.entries(body).filter(([key]) => !['type', 'event', 'id', 'createdAt'].includes(key)))

  return {
    ok: true,
    event: {
      id: asString(body.id) || asString(body.event_id),
      type,
      createdAt: asString(body.createdAt) || asString(body.created_at),
      data,
    },
  }
}

// Known event types get a hand-written subject and heading. Anything else
// still sends, using the humanized type — an unrecognized event should reach
// a human rather than disappear.
const EVENT_TEMPLATES: Record<string, { heading: string; subject: (event: WebhookEvent) => string }> = {
  'order.created': {
    heading: 'New order',
    subject: (e) => `New order${subjectSuffix(e, ['orderNumber', 'order_number', 'id'])}`,
  },
  'order.paid': {
    heading: 'Order paid',
    subject: (e) => `Order paid${subjectSuffix(e, ['orderNumber', 'order_number', 'id'])}`,
  },
  'order.cancelled': {
    heading: 'Order cancelled',
    subject: (e) => `Order cancelled${subjectSuffix(e, ['orderNumber', 'order_number', 'id'])}`,
  },
  'customer.created': {
    heading: 'New customer',
    subject: (e) => `New customer${subjectSuffix(e, ['name', 'email'])}`,
  },
  'quote.requested': {
    heading: 'New quote request',
    subject: (e) => `New quote request${subjectSuffix(e, ['name', 'organization', 'email'])}`,
  },
}

function subjectSuffix(event: WebhookEvent, keys: string[]) {
  for (const key of keys) {
    const value = event.data[key]
    if (typeof value === 'string' || typeof value === 'number') return ` — ${value}`
  }
  return ''
}

function humanize(type: string) {
  const words = type.replace(/[._-]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function labelize(key: string) {
  return key
    .replace(/[._-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase())
}

const BRAND_GREEN = '#007A63'

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function formatValue(value: unknown): string | undefined {
  if (value === null || value === undefined || value === '') return undefined
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)
  // Nested objects/arrays get pretty-printed rather than dropped, so an
  // unfamiliar payload shape is still readable in the inbox.
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return undefined
  }
}

function row(label: string, value?: string) {
  if (!value) return ''
  const multiline = value.includes('\n')
  return `
    <tr>
      <td style="padding:6px 0;font-size:13px;color:#666;width:150px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:6px 0;font-size:14px;color:#111;vertical-align:top;${
        multiline ? 'font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;' : ''
      }">${escapeHtml(value)}</td>
    </tr>
  `
}

export function eventNotificationEmail(event: WebhookEvent): { subject: string; html: string } {
  const template = EVENT_TEMPLATES[event.type]
  const heading = template ? template.heading : humanize(event.type)
  const subject = template ? template.subject(event) : `Webhook: ${event.type}`

  const dataRows = Object.entries(event.data)
    .map(([key, value]) => row(labelize(key), formatValue(value)))
    .join('')

  const metaRows = [
    row('Event type', event.type),
    row('Event ID', event.id),
    row('Sent at', event.createdAt),
    row('Received at', new Date().toISOString()),
  ].join('')

  const html = `
  <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="font-weight:800;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND_GREEN};margin-bottom:24px;">
      Kocreators
    </div>
    <h1 style="font-size:20px;margin:0 0 16px;color:#111;">${escapeHtml(heading)}</h1>
    ${
      dataRows
        ? `<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${dataRows}</table>`
        : `<p style="font-size:14px;color:#666;">This event arrived with no data fields.</p>`
    }
    <p style="margin:0 0 6px;font-size:13px;color:#666;">Event details</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee;">${metaRows}</table>
    <p style="margin-top:32px;font-size:12px;color:#999;">Automated message from the Kocreators webhook listener.</p>
  </div>
  `

  return { subject, html }
}
