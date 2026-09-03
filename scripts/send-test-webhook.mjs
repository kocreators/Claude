#!/usr/bin/env node
// Sends a correctly signed test event to the webhook listener.
//
//   npm run webhook:test                       # order.created against localhost
//   npm run webhook:test -- quote.requested    # a different event type
//   WEBHOOK_URL=https://kocreators.com/api/webhooks npm run webhook:test
//
// WEBHOOK_SECRET is read from the environment, falling back to .env.local.

import crypto from 'node:crypto'
import fs from 'node:fs'

function secretFromEnvFile() {
  try {
    const line = fs
      .readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
      .split('\n')
      .find((l) => l.startsWith('WEBHOOK_SECRET='))
    return line?.slice('WEBHOOK_SECRET='.length).trim().replace(/^["']|["']$/g, '')
  } catch {
    return undefined
  }
}

const secret = process.env.WEBHOOK_SECRET || secretFromEnvFile()
if (!secret) {
  console.error('WEBHOOK_SECRET is not set (checked the environment and .env.local).')
  process.exit(1)
}

const url = process.env.WEBHOOK_URL || 'http://localhost:3000/api/webhooks'
const type = process.argv[2] || 'order.created'

const payload = {
  id: `evt_${crypto.randomUUID()}`,
  type,
  createdAt: new Date().toISOString(),
  data: {
    orderNumber: '1042',
    name: 'Test Customer',
    email: 'test@example.com',
    total: '$249.00',
    note: 'Sent by scripts/send-test-webhook.mjs',
  },
}

const rawBody = JSON.stringify(payload)
const timestamp = Math.floor(Date.now() / 1000).toString()
const signature = crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex')

const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Timestamp': timestamp,
    'X-Webhook-Signature': `sha256=${signature}`,
  },
  body: rawBody,
})

console.log(`${res.status} ${res.statusText} — ${await res.text()}`)
process.exit(res.ok ? 0 : 1)
