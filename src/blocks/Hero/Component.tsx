'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

const DEFAULT_BG = '/images/hero-desk-v2.jpg'

export function HeroBlock({ block }: { block: any }) {
  const img = block.backgroundImage
  const secondaryImg = block.secondaryImage
  const headlineLines = String(block.headline || '').split('\n').filter(Boolean)
  const bgSrc = img?.url || DEFAULT_BG

  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const update = () => {
      ticking = false
      const el = sectionRef.current
      if (!el) return
      const fadeDistance = (el.offsetHeight || 1) * 0.6
      const next = Math.min(Math.max(-el.getBoundingClientRect().top / fadeDistance, 0), 1)
      setProgress(next)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Visible from the start, then settles into the background as the hero scrolls away.
  const imageOpacity = 0.55 - 0.35 * progress
  const imageScale = 1 + 0.07 * progress

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink text-canvas-light"
    >
      <Image
        src={bgSrc}
        alt={img?.alt || ''}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover"
        style={{ opacity: imageOpacity, transform: `scale(${imageScale})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10" />

      {secondaryImg?.url && (
        <div className="absolute right-8 top-24 hidden aspect-[3/4] w-[26vw] max-w-sm overflow-hidden border-4 border-canvas-light/10 shadow-2xl lg:block">
          <Image src={secondaryImg.url} alt={secondaryImg.alt || ''} fill sizes="30vw" className="object-cover" />
        </div>
      )}

      <Container className="relative pb-20 pt-40 md:pb-24">
        {block.eyebrow && (
          <p className="eyebrow mb-5 bg-[rgba(8,12,11,0.45)] px-3 py-1.5 tracking-[0.08em] text-[#2fa98e] backdrop-blur-[6px]">
            {block.eyebrow}
          </p>
        )}
        <h1 className="text-display max-w-3xl drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
          {headlineLines.length > 0
            ? headlineLines.map((line: string, i: number) => <span key={i} className="block">{line}</span>)
            : block.headline}
        </h1>
        {block.subhead && (
          <p className="mt-7 max-w-xl text-lg font-medium leading-[1.5] text-canvas-light/80">{block.subhead}</p>
        )}
        <div className="mt-9 flex flex-wrap items-center gap-5">
          {block.cta && <CTAButton link={block.cta} variant="primary" />}
          {block.secondaryCta && <CTAButton link={block.secondaryCta} variant="outline-light" />}
        </div>
      </Container>
    </section>
  )
}
