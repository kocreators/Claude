'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

// Handoff key written by StoreSignupForm immediately before it navigates here.
export const SIGNUP_HANDOFF_KEY = 'kc_store_signup'

// Fires the `store_signup` conversion event, once, and only for someone who
// actually just submitted the form.
//
// The page itself is a real URL, so it can be bookmarked, refreshed, shared or
// opened directly — every one of which would count as a conversion if the tag
// were tied to the pageview. Instead the form leaves a one-shot marker in
// sessionStorage, which this reads and immediately clears. No marker means no
// event: the visitor still sees the page, but nothing is reported.
//
// Firing here rather than before the redirect also avoids a race — a hard
// navigation can cut off a tag's request mid-flight. On a fresh page load the
// tag has the whole page lifetime to send.
export function SignupThankYouTracking() {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    let handoff: { plan?: string; plan_landed?: string } | null = null
    try {
      const raw = sessionStorage.getItem(SIGNUP_HANDOFF_KEY)
      if (raw) {
        handoff = JSON.parse(raw)
        sessionStorage.removeItem(SIGNUP_HANDOFF_KEY)
      }
    } catch {
      // Private mode or blocked storage — fall through and report nothing
      // rather than risk counting a conversion that did not happen.
    }

    if (!handoff) return

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'store_signup',
      plan: handoff.plan,
      plan_landed: handoff.plan_landed,
    })
  }, [])

  return null
}
