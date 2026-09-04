// Smartlead's webhooks can't be signed: their setup UI exposes no signing
// secret, and they send no signature header we can verify. Authentication is
// therefore a high-entropy token in the URL, which means this module treats
// the payload itself as untrusted and validates its shape before acting.

import type { WebhookEvent } from './events'

/**
 * Events worth an email. Smartlead also fires EMAIL_SENT / EMAIL_OPEN /
 * EMAIL_LINK_CLICK for every message in a sequence — forwarding those would
 * bury the inbox in seconds and make the useful ones unfindable. Anything not
 * listed here is acknowledged with a 200 and logged, never silently dropped.
 */
export const DEFAULT_NOTIFY_EVENTS = ['EMAIL_REPLY', 'EMAIL_BOUNCE', 'LEAD_CATEGORY_UPDATED']

export function notifyEvents(): string[] {
  const configured = process.env.SMARTLEAD_NOTIFY_EVENTS
  if (!configured) return DEFAULT_NOTIFY_EVENTS
  return configured
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
}

// A reply body is arbitrary length and often carries the whole quoted thread.
// Cap it so one long reply can't produce a megabyte email.
const MAX_BODY_CHARS = 4000

function asString(value: unknown) {
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function truncate(value: string) {
  return value.length > MAX_BODY_CHARS ? `${value.slice(0, MAX_BODY_CHARS)}\n\n… truncated` : value
}

export type SmartleadParseResult =
  | { ok: true; eventType: string; event: WebhookEvent }
  | { ok: false; reason: string }

/**
 * Validates the documented Smartlead envelope and maps it onto the shape the
 * shared email renderer expects. Unrecognized top-level scalars are passed
 * through so a field Smartlead adds later still reaches the inbox.
 */
export function parseSmartleadEvent(payload: unknown, requestId?: string): SmartleadParseResult {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, reason: 'body must be a JSON object' }
  }

  const body = payload as Record<string, unknown>
  const eventType = asString(body.event_type)?.toUpperCase()
  if (!eventType) return { ok: false, reason: 'missing "event_type" field' }

  const curated: Record<string, unknown> = {
    'From (lead)': asString(body.to_name) || asString(body.to_email),
    'Lead email': asString(body.to_email),
    'Sent from': asString(body.from_email),
    Campaign: asString(body.campaign_name),
    'Campaign ID': asString(body.campaign_id),
    'Sequence step': asString(body.sequence_number),
    Subject: asString(body.subject),
    'Lead category': asString(body.lead_category) || asString(body.category),
  }

  const replyBody = asString(body.reply_body) || asString(body.preview_text)
  if (replyBody) curated.Reply = truncate(replyBody)

  // Anything else Smartlead sends that renders sensibly as a row.
  const known = new Set([
    'event_type',
    'to_name',
    'to_email',
    'from_email',
    'campaign_name',
    'campaign_id',
    'sequence_number',
    'subject',
    'lead_category',
    'category',
    'reply_body',
    'preview_text',
    'time_replied',
    'event_timestamp',
    'secret_key',
  ])
  for (const [key, value] of Object.entries(body)) {
    if (known.has(key)) continue
    const scalar = asString(value)
    if (scalar) curated[key] = scalar
  }

  const data = Object.fromEntries(Object.entries(curated).filter(([, v]) => v !== undefined))

  return {
    ok: true,
    eventType,
    event: {
      id: requestId,
      type: `smartlead.${eventType.toLowerCase()}`,
      createdAt: asString(body.time_replied) || asString(body.event_timestamp),
      data,
    },
  }
}
