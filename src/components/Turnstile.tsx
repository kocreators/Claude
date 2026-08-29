'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      theme?: 'light' | 'dark'
      callback?: (token: string) => void
      'expired-callback'?: () => void
      'error-callback'?: () => void
    },
  ) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    __onTurnstileScriptLoad?: () => void
  }
}

// Renders the Cloudflare Turnstile challenge inside a <form>, injecting a
// hidden "cf-turnstile-response" input that submits along with the rest of
// the form fields. Rendered explicitly (rather than via the script's own
// data-sitekey auto-scan) because the implicit mode is unreliable here — it
// scans the DOM once when the script loads and can race with React mounting
// the widget container, leaving a dead placeholder with no challenge iframe.
export function Turnstile() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [scriptReady, setScriptReady] = useState(false)

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile) return
    const container = containerRef.current

    const widgetId = window.turnstile.render(container, {
      sitekey: siteKey,
      theme: 'light',
      // Tokens expire after ~5 minutes and Turnstile doesn't refresh itself.
      // The quote form (name, email, phone, product details, file upload,
      // dates, message) can easily take longer than that to fill out, so
      // without this the visitor's token is silently dead by submit time.
      'expired-callback': () => {
        if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current)
      },
      'error-callback': () => {
        if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current)
      },
    })
    widgetIdRef.current = widgetId

    return () => {
      window.turnstile?.remove(widgetId)
      widgetIdRef.current = null
    }
  }, [siteKey, scriptReady])

  if (!siteKey) {
    return (
      <p className="border border-dashed border-ink/20 px-4 py-3 text-xs text-ink/50">
        Captcha not configured — set NEXT_PUBLIC_TURNSTILE_SITE_KEY to enable it.
      </p>
    )
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        async
        defer
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} />
    </>
  )
}
