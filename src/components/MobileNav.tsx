'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resolveLink } from '@/lib/resolveLink'

export function MobileNav({ navItems, quoteCta }: { navItems: any[]; quoteCta: any }) {
  const [open, setOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="lg:hidden">
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span className={`h-[2px] w-6 bg-ink transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
        <span className={`h-[2px] w-6 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
        <span className={`h-[2px] w-6 bg-ink transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
      </button>

      {open && (
        <div className="fixed inset-x-0 top-20 z-40 h-[calc(100vh-5rem)] overflow-y-auto bg-canvas-light">
          <nav className="flex flex-col divide-y divide-ink/10 px-6">
            {navItems.map((item, i) => {
              const { href, label } = resolveLink(item.link)
              const subItems = (item.subItems || []) as any[]
              const isOpen = openIndex === i

              return (
                <div key={i} className="py-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="py-3 text-2xl font-black uppercase tracking-tight text-ink"
                    >
                      {label}
                    </Link>
                    {subItems.length > 0 && (
                      <button
                        aria-label={`Toggle ${label} submenu`}
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        className="flex h-10 w-10 items-center justify-center text-xl text-ink"
                      >
                        {isOpen ? '–' : '+'}
                      </button>
                    )}
                  </div>
                  {isOpen && subItems.length > 0 && (
                    <div className="flex flex-col gap-1 pb-4 pl-1">
                      {subItems.map((sub, j) => {
                        const subLink = resolveLink(sub.link)
                        return (
                          <Link
                            key={j}
                            href={subLink.href}
                            onClick={() => setOpen(false)}
                            className="py-2 text-sm text-ink/70 hover:text-brand"
                          >
                            {subLink.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="flex flex-col gap-4 px-6 py-8">
            {quoteCta && (
              <Link href={resolveLink(quoteCta).href} onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                {resolveLink(quoteCta).label}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
