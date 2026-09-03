import crypto from 'crypto'

// Senders must include both headers. The signature covers the timestamp as
// well as the body, so a captured request can't be replayed with a fresh
// timestamp — and can't be replayed with its original one either, once the
// tolerance window below has passed.
export const SIGNATURE_HEADER = 'x-webhook-signature'
export const TIMESTAMP_HEADER = 'x-webhook-timestamp'

export const DEFAULT_TOLERANCE_SECONDS = 300

/** The exact string that gets HMAC'd: `<unix seconds>.<raw request body>` */
export function signingString(timestamp: string | number, rawBody: string) {
  return `${timestamp}.${rawBody}`
}

export function sign(secret: string, timestamp: string | number, rawBody: string) {
  return crypto.createHmac('sha256', secret).update(signingString(timestamp, rawBody)).digest('hex')
}

export type VerifyResult = { ok: true } | { ok: false; reason: string }

export function verifySignature({
  secret,
  rawBody,
  signatureHeader,
  timestampHeader,
  toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
  now = Date.now(),
}: {
  secret: string
  rawBody: string
  signatureHeader: string | null
  timestampHeader: string | null
  toleranceSeconds?: number
  now?: number
}): VerifyResult {
  if (!signatureHeader) return { ok: false, reason: `missing ${SIGNATURE_HEADER} header` }
  if (!timestampHeader) return { ok: false, reason: `missing ${TIMESTAMP_HEADER} header` }

  const timestamp = Number(timestampHeader)
  if (!Number.isInteger(timestamp)) return { ok: false, reason: `${TIMESTAMP_HEADER} must be unix seconds` }

  const ageSeconds = Math.abs(now / 1000 - timestamp)
  if (ageSeconds > toleranceSeconds) {
    return { ok: false, reason: `timestamp outside the ${toleranceSeconds}s tolerance window` }
  }

  // Accept both `abc123…` and Stripe-style `sha256=abc123…`, since most
  // senders let you template one or the other but not always both.
  const provided = signatureHeader.trim().replace(/^sha256=/i, '').toLowerCase()
  const expected = sign(secret, timestampHeader, rawBody)

  // timingSafeEqual throws on length mismatch, so compare lengths first —
  // length isn't a secret.
  if (provided.length !== expected.length) return { ok: false, reason: 'signature mismatch' }
  if (!crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) {
    return { ok: false, reason: 'signature mismatch' }
  }

  return { ok: true }
}
