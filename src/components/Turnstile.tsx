'use client'

import Script from 'next/script'

// Renders the Cloudflare Turnstile challenge inside a <form>. On success it
// injects a hidden "cf-turnstile-response" input that submits along with the
// rest of the form fields — no extra client-side wiring needed.
export function Turnstile() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  if (!siteKey) {
    return (
      <p className="border border-dashed border-ink/20 px-4 py-3 text-xs text-ink/50">
        Captcha not configured — set NEXT_PUBLIC_TURNSTILE_SITE_KEY to enable it.
      </p>
    )
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="light" />
    </>
  )
}
