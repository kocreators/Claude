'use client'

import { useActionState } from 'react'
import { Container } from '@/components/Container'
import { submitContactForm, type ContactFormState } from './actions'

const initialState: ContactFormState = { status: 'idle' }

export function ContactFormBlockComponent({ block }: { block: any }) {
  const boundAction = submitContactForm.bind(null, block.formType || 'quote')
  const [state, formAction, pending] = useActionState(boundAction, initialState)

  return (
    <section className="bg-canvas-light py-24">
      <Container className="max-w-2xl">
        <h2 className="mb-4 text-3xl md:text-4xl">{block.heading}</h2>
        {block.subhead && <p className="mb-10 text-ink/70">{block.subhead}</p>}

        {state.status === 'success' ? (
          <p className="border-l-2 border-brand pl-4 text-ink/80">{state.message}</p>
        ) : (
          <form action={formAction} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <input name="name" required placeholder="Full name" className="border border-ink/20 bg-canvas-light px-4 py-3 text-sm" />
              <input name="email" type="email" required placeholder="Email" className="border border-ink/20 bg-canvas-light px-4 py-3 text-sm" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <input name="phone" placeholder="Phone (optional)" className="border border-ink/20 bg-canvas-light px-4 py-3 text-sm" />
              <input name="organization" placeholder="Team / school / business" className="border border-ink/20 bg-canvas-light px-4 py-3 text-sm" />
            </div>
            <textarea name="message" rows={5} placeholder="Tell us about your project" className="border border-ink/20 bg-canvas-light px-4 py-3 text-sm" />
            {state.status === 'error' && <p className="text-sm text-red-600">{state.message}</p>}
            <button type="submit" disabled={pending} className="btn-primary w-fit disabled:opacity-60">
              {pending ? 'Sending…' : 'Send it'}
            </button>
          </form>
        )}
      </Container>
    </section>
  )
}
