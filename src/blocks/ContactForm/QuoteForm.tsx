'use client'

import { useActionState, useState } from 'react'
import { Turnstile } from '@/components/Turnstile'
import { submitContactForm, type ContactFormState } from './actions'

const initialState: ContactFormState = { status: 'idle' }

const inputClass =
  'w-full border border-ink/15 bg-canvas-light px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none'
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-eyebrowWide text-ink/50'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
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

const emptyFields = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  productInterest: '',
  productColor: '',
  quantity: '',
  inHandsDate: '',
  message: '',
}

export function QuoteForm() {
  const boundAction = submitContactForm.bind(null, 'quote')
  const [state, formAction, pending] = useActionState(boundAction, initialState)
  const [fileNames, setFileNames] = useState<string[]>([])
  // Controlled fields — a failed submission (e.g. captcha error) re-renders
  // this form, and uncontrolled inputs would otherwise lose their values.
  const [fields, setFields] = useState(emptyFields)

  const update = (key: keyof typeof emptyFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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

      <div className="grid gap-6 sm:grid-cols-2">
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
        <Field label="Mobile Phone" required>
          <input
            name="phone"
            type="tel"
            required
            placeholder="(555) 123-4567"
            className={inputClass}
            value={fields.phone}
            onChange={update('phone')}
          />
        </Field>
      </div>

      <div className="border-t border-ink/10 pt-6">
        <Field label="Product(s) Interested In" required>
          <input
            name="productInterest"
            required
            placeholder="e.g. T-shirts, hoodies, caps"
            className={inputClass}
            value={fields.productInterest}
            onChange={update('productInterest')}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Product Color">
          <input
            name="productColor"
            placeholder="e.g. Forest green"
            className={inputClass}
            value={fields.productColor}
            onChange={update('productColor')}
          />
        </Field>
        <Field label="Estimated Quantity">
          <input
            name="quantity"
            placeholder="Estimated quantity 500-750"
            className={inputClass}
            value={fields.quantity}
            onChange={update('quantity')}
          />
        </Field>
      </div>

      <Field label="Upload Logo(s)">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed border-ink/25 bg-canvas px-4 py-8 text-center transition-colors hover:border-brand">
          <span className="text-sm font-medium text-ink/70">
            {fileNames.length ? fileNames.join(', ') : 'Click to upload logo files'}
          </span>
          <span className="text-xs text-ink/40">PNG, JPG, PDF, AI, or EPS — up to 15MB each</span>
          <input
            type="file"
            name="logos"
            multiple
            accept="image/*,.pdf,.ai,.eps"
            className="hidden"
            onChange={(e) => setFileNames(Array.from(e.target.files || []).map((f) => f.name))}
          />
        </label>
      </Field>

      <Field label="In-Hands Deadline">
        <input
          name="inHandsDate"
          type="date"
          className={`${inputClass} sm:w-1/2`}
          value={fields.inHandsDate}
          onChange={update('inHandsDate')}
        />
      </Field>

      <Field label="Anything Else You'd Like Us to Know?">
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us more about your project"
          className={inputClass}
          value={fields.message}
          onChange={update('message')}
        />
      </Field>

      <Turnstile />

      {state.status === 'error' && <p className="text-sm text-red-600">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-fit disabled:opacity-60">
        {pending ? 'Sending…' : 'Submit'}
      </button>
    </form>
  )
}
