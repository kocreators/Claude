'use client'

import { useEffect, useRef } from 'react'

export function FormSuccess({
  message,
  phone,
  email,
}: {
  message?: string
  phone?: string | null
  email?: string | null
}) {
  const ref = useRef<HTMLDivElement>(null)

  // The form it replaces can be 1000px+ tall — collapsing straight to a
  // short message shifts the whole page up and can leave the visitor
  // looking at whatever now sits at their old scroll offset (e.g. the
  // footer). Scroll the confirmation into view so it's never missed.
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  return (
    <div ref={ref} className="flex flex-col items-center py-6 text-center md:py-10">
      <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-canvas-light">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <h3 className="mb-3 text-2xl">Request Received</h3>
      <p className="max-w-sm text-ink/70">Thanks for reaching out.</p>
      <p className="mt-2 max-w-sm text-ink/70">{message}</p>

      {(phone || email) && (
        <div className="mt-8 w-full max-w-sm border-t border-ink/10 pt-6">
          <p className="mb-1.5 text-sm font-bold text-ink">Need help sooner?</p>
          <p className="text-sm text-ink/70">
            {phone && (
              <>
                Call us at{' '}
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="font-medium text-brand">
                  {phone}
                </a>
              </>
            )}
            {phone && email && ' or email '}
            {email && (
              <a href={`mailto:${email}`} className="font-medium text-brand">
                {email}
              </a>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
