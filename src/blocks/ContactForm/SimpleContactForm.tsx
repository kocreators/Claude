'use client'

import { useActionState } from 'react'
import { submitContactForm, type ContactFormState } from './actions'
import { Turnstile } from '@/components/Turnstile'
import { FormSuccess } from './FormSuccess'

const initialState: ContactFormState = { status: 'idle' }

export function SimpleContactForm({ phone, email }: { phone?: string | null; email?: string | null }) {
  const boundAction = submitContactForm.bind(null, 'contact')
  const [state, formAction, pending] = useActionState(boundAction, initialState)

  if (state.status === 'success') {
    return <FormSuccess message={state.message} phone={phone} email={email} />
  }

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <input name="name" required placeholder="Full name" className="border border-ink/20 bg-canvas-light px-4 py-3 text-sm" />
        <input name="email" type="email" required placeholder="Email" className="border border-ink/20 bg-canvas-light px-4 py-3 text-sm" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <input name="phone" placeholder="Phone (optional)" className="border border-ink/20 bg-canvas-light px-4 py-3 text-sm" />
        <input name="organization" placeholder="Your Group Name" className="border border-ink/20 bg-canvas-light px-4 py-3 text-sm" />
      </div>
      <textarea name="message" rows={5} placeholder="Your message" className="border border-ink/20 bg-canvas-light px-4 py-3 text-sm" />
      <Turnstile />
      {state.status === 'error' && <p className="text-sm text-red-600">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-fit disabled:opacity-60">
        {pending ? 'Sending…' : 'Send it'}
      </button>
    </form>
  )
}
