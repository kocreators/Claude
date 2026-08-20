import Image from 'next/image'
import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

export function PromoSpotlightBlock({ block }: { block: any }) {
  const headlineLines = String(block.heading || '').split('\n').filter(Boolean)
  const items = (block.items || []) as any[]

  return (
    <section className="bg-canvas py-24 md:py-32">
      <Container>
        <div className="mb-14 grid gap-8 md:grid-cols-2 md:items-end">
          <h2 className="text-4xl leading-[0.95] md:text-5xl">
            {headlineLines.length > 0
              ? headlineLines.map((line: string, i: number) => <span key={i} className="block">{line}</span>)
              : block.heading}
          </h2>
          {block.body && <p className="max-w-md text-ink/70 md:justify-self-end md:text-right">{block.body}</p>}
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden bg-ink/10 md:grid-cols-4">
          {items.map((item, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden bg-canvas-light">
              {typeof item.image === 'object' && item.image?.url && (
                <Image
                  src={item.image.url}
                  alt={item.image.alt || item.label}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4">
                <span className="font-mono text-xs uppercase tracking-widest2 text-canvas-light">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {block.cta && (
          <div className="mt-12">
            <CTAButton link={block.cta} variant="outline" />
          </div>
        )}
      </Container>
    </section>
  )
}
