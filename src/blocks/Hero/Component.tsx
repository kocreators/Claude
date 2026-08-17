import Image from 'next/image'
import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

export function HeroBlock({ block }: { block: any }) {
  const img = block.backgroundImage
  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-ink text-canvas">
      {img?.url && (
        <Image
          src={img.url}
          alt={img.alt || ''}
          fill
          priority
          className="absolute inset-0 object-cover opacity-60"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <Container className="relative pb-20 pt-40">
        {block.eyebrow && <p className="eyebrow mb-4 text-thread">{block.eyebrow}</p>}
        <h1 className="max-w-4xl text-5xl leading-[0.95] md:text-7xl">{block.headline}</h1>
        {block.subhead && <p className="mt-6 max-w-xl text-canvas/80">{block.subhead}</p>}
        {block.cta?.link && (
          <div className="mt-8">
            <CTAButton link={block.cta.link} variant="primary" />
          </div>
        )}
      </Container>
    </section>
  )
}
