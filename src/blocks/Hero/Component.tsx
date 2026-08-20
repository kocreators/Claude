import Image from 'next/image'
import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

export function HeroBlock({ block }: { block: any }) {
  const img = block.backgroundImage
  const secondaryImg = block.secondaryImage
  const headlineLines = String(block.headline || '').split('\n').filter(Boolean)

  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink text-canvas-light">
      {img?.url && (
        <Image
          src={img.url}
          alt={img.alt || ''}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover opacity-70"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />

      {secondaryImg?.url && (
        <div className="absolute right-8 top-24 hidden aspect-[3/4] w-[26vw] max-w-sm overflow-hidden border-4 border-canvas-light/10 shadow-2xl lg:block">
          <Image src={secondaryImg.url} alt={secondaryImg.alt || ''} fill sizes="30vw" className="object-cover" />
        </div>
      )}

      <Container className="relative pb-20 pt-40 md:pb-24">
        {block.eyebrow && <p className="eyebrow mb-5">{block.eyebrow}</p>}
        <h1 className="max-w-3xl text-6xl leading-[0.92] md:text-8xl">
          {headlineLines.length > 0
            ? headlineLines.map((line: string, i: number) => <span key={i} className="block">{line}</span>)
            : block.headline}
        </h1>
        {block.subhead && <p className="mt-7 max-w-xl text-lg text-canvas-light/80">{block.subhead}</p>}
        <div className="mt-9 flex flex-wrap items-center gap-5">
          {block.cta && <CTAButton link={block.cta} variant="primary" />}
          {block.secondaryCta && <CTAButton link={block.secondaryCta} variant="outline-light" />}
        </div>
      </Container>
    </section>
  )
}
