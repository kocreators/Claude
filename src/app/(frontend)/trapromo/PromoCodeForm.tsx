'use client'

import { useActionState, useState } from 'react'
import { Turnstile } from '@/components/Turnstile'
import { submitContactForm, type ContactFormState } from '@/blocks/ContactForm/actions'

const initialState: ContactFormState = { status: 'idle' }

const inputClass =
  'w-full border border-ink/15 bg-canvas-light px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none'
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-eyebrowWide text-ink/50'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        <span className="text-brand"> *</span>
      </label>
      {children}
    </div>
  )
}

export function PromoCodeForm({ phone, email }: { phone?: string | null; email?: string | null }) {
  const boundAction = submitContactForm.bind(null, 'promoCode')
  const [state, formAction, pending] = useActionState(boundAction, initialState)
  const [fields, setFields] = useState({ firstName: '', lastName: '', email: '' })

  const update =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }))

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-center py-6 text-center md:py-10">
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-canvas-light">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h2 className="mb-3 text-2xl">Request Received</h2>
        <p className="max-w-sm text-ink/70">
          We&rsquo;ll create a promo code tied to your store account and email it to you shortly.
        </p>
        <p className="mt-4 max-w-sm text-sm text-ink/60">
          Haven&rsquo;t registered on the store yet? Do that now with the same email address so we can
          attach the code to your account.
        </p>

        {(phone || email) && (
          <div className="mt-8 w-full max-w-sm border-t border-ink/10 pt-6">
            <p className="mb-1.5 text-sm font-bold text-ink">Questions?</p>
            <p className="text-sm text-ink/70">
              {phone && (
                <>
                  Call{' '}
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

  return (
    <form action={formAction} className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="First Name">
          <input
            name="firstName"
            required
            placeholder="Jane"
            className={inputClass}
            value={fields.firstName}
            onChange={update('firstName')}
          />
        </Field>
        <Field label="Last Name">
          <input
            name="lastName"
            required
            placeholder="Doe"
            className={inputClass}
            value={fields.lastName}
            onChange={update('lastName')}
          />
        </Field>
      </div>

      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          placeholder="jane@email.com"
          className={inputClass}
          value={fields.email}
          onChange={update('email')}
        />
        <p className="mt-2 text-xs text-ink/50">
          Use the same email you registered with on the store.
        </p>
      </Field>

      <Turnstile />

      {state.status === 'error' && <p className="text-sm text-red-600">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-fit disabled:opacity-60">
        {pending ? 'Sending…' : 'Request My Promo Code'}
      </button>
    </form>
  )
}
