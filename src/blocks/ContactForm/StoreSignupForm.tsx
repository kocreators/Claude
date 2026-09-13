'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Turnstile } from '@/components/Turnstile'
import { submitContactForm, type ContactFormState } from './actions'
import { FormSuccess } from './FormSuccess'
import { SIGNUP_HANDOFF_KEY } from '@/app/(frontend)/store-signup/thank-you/SignupThankYouTracking'

const initialState: ContactFormState = { status: 'idle' }

const inputClass =
  'w-full border border-ink/15 bg-canvas-light px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none'
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-eyebrowWide text-ink/50'

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="text-brand"> *</span>}
      </label>
      {children}
    </div>
  )
}

export function StoreSignupForm({ phone, email }: { phone?: string | null; email?: string | null }) {
  const boundAction = submitContactForm.bind(null, 'storeSignup')
  const [state, formAction, pending] = useActionState(boundAction, initialState)
  const searchParams = useSearchParams()
  const initialPlan = searchParams.get('plan') === 'pro' ? 'pro' : 'basic'

  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    storePlatform: initialPlan,
  })

  const update =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }))

  // On success, hand off to the thank-you page.
  //
  // window.location.assign rather than router.push: a soft navigation changes
  // the URL without a page load, which is exactly what analytics tools cannot
  // see. A full load makes the confirmation a real page, and gives the
  // conversion tag a normal page lifetime to fire in.
  //
  // The plan travels in sessionStorage rather than only the query string, so
  // that refreshing or sharing the thank-you URL does not report a second
  // conversion — the marker is one-shot and the page clears it on read. The
  // ?plan= is carried too, but only so the page can name the plan on screen.
  const handedOff = useRef(false)
  useEffect(() => {
    if (state.status !== 'success' || handedOff.current) return
    handedOff.current = true

    const plan = fields.storePlatform
    try {
      sessionStorage.setItem(
        SIGNUP_HANDOFF_KEY,
        JSON.stringify({ plan, plan_landed: initialPlan }),
      )
    } catch {
      // Storage blocked — still send them to the confirmation page; it simply
      // will not report the conversion.
    }

    window.location.assign(`/store-signup/thank-you?plan=${encodeURIComponent(plan)}`)
  }, [state.status, fields.storePlatform, initialPlan])

  // Shown for the moment between a successful submit and the redirect landing,
  // and as the fallback if navigation is blocked.
  if (state.status === 'success') {
    return <FormSuccess message={state.message} phone={phone} email={email} />
  }

  return (
    <form action={formAction} className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="First Name" required>
          <input name="firstName" required placeholder="Jane" className={inputClass} value={fields.firstName} onChange={update('firstName')} />
        </Field>
        <Field label="Last Name" required>
          <input name="lastName" required placeholder="Doe" className={inputClass} value={fields.lastName} onChange={update('lastName')} />
        </Field>
      </div>

      <Field label="Email" required>
        <input
          name="email"
          type="email"
          required
          placeholder="jane@company.com"
          className={inputClass}
          value={fields.email}
          onChange={update('email')}
        />
      </Field>

      <Field label="Mobile Phone">
        <input
          name="phone"
          type="tel"
          placeholder="(555) 123-4567"
          className={inputClass}
          value={fields.phone}
          onChange={update('phone')}
        />
      </Field>

      <Field label="Business Name" required>
        <input
          name="businessName"
          required
          placeholder="Your Business Name"
          className={inputClass}
          value={fields.businessName}
          onChange={update('businessName')}
        />
      </Field>

      <Field label="Select Your Store Platform">
        <select name="storePlatform" className={inputClass} value={fields.storePlatform} onChange={update('storePlatform')}>
          <option value="basic">Free — 10 Product Limit</option>
          <option value="pro">Pro — Unlimited Categories & SKUs ($249)</option>
        </select>
      </Field>

      <Turnstile />

      {state.status === 'error' && <p className="text-sm text-red-600">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-fit disabled:opacity-60">
        {pending ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  )
}
