'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { resolveLink } from '@/lib/resolveLink'

type FaqItem = { question: string; answer: string }

export function FaqAccordion({
  eyebrow,
  heading,
  note,
  noteLink,
  items,
}: {
  eyebrow?: string | null
  heading?: string | null
  note?: string | null
  noteLink?: any
  items: FaqItem[]
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const headlineLines = String(heading || '').split('\n').filter(Boolean)
  const link = noteLink ? resolveLink(noteLink) : null

  if (!items.length) return null

  return (
    <section className="bg-canvas py-5 md:py-7">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
            <h2 className="mb-6 text-4xl leading-[0.95] md:text-5xl">
              {headlineLines.length > 0
                ? headlineLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))
                : heading}
            </h2>
            {note && (
              <p className="text-ink/60">
                {note}{' '}
                {link?.label && (
                  <Link href={link.href} target={link.target} className="font-bold text-ink underline underline-offset-4 hover:text-brand">
                    {link.label}
                  </Link>
                )}
              </p>
            )}
          </div>

          <div className="border-t border-ink/10">
            {items.map((item, i) => {
              const isOpen = openIndex === i
              return (
                <div key={i} className="border-b border-ink/10">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-lg font-bold text-ink md:text-xl">{item.question}</span>
                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center text-2xl font-light text-brand transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] pb-6 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <p className="min-h-0 max-w-2xl text-ink/70">{item.answer}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
