'use client'

import { useActionState, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Turnstile } from '@/components/Turnstile'
import { submitContactForm, type ContactFormState } from './actions'

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

export function StoreSignupForm() {
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

  if (state.status === 'success') {
    return <p className="border-l-2 border-brand pl-4 text-ink/80">{state.message}</p>
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
