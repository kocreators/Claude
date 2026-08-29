import Image from 'next/image'
import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

export function PromoSpotlightBlock({ block }: { block: any }) {
  const headlineLines = String(block.heading || '').split('\n').filter(Boolean)
  const items = (block.items || []) as any[]

  return (
    <section className="bg-canvas py-6 md:py-8">
      <Container>
        <div className="mb-14 grid gap-8 md:grid-cols-3 md:items-end">
          <h2 className="text-4xl leading-[0.95] md:col-span-2 md:text-5xl">
            {headlineLines.length > 0
              ? headlineLines.map((line: string, i: number) => <span key={i} className="block">{line}</span>)
              : block.heading}
          </h2>
          {block.body && <p className="max-w-md text-ink/70 md:justify-self-end md:text-right">{block.body}</p>}
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {items.map((item, i) => {
            const Tag = item.url ? 'a' : 'div'
            const linkProps = item.url ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' } : {}
            return (
              <Tag
                key={i}
                {...linkProps}
                className="group block border border-ink/10 bg-canvas-light p-3 transition-shadow duration-300 hover:shadow-[0_12px_28px_rgba(17,17,17,0.08)] md:p-4"
              >
                <div className="relative mb-4 aspect-square overflow-hidden bg-canvas">
                  {typeof item.image === 'object' && item.image?.url ? (
                    <Image
                      src={item.image.url}
                      alt={item.image.alt || item.label}
                      fill
                      sizes="25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-ink-soft" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-ink/10 pt-3">
                  <span className="label text-ink">{item.label}</span>
                  {item.url && (
                    <span className="text-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100">→</span>
                  )}
                </div>
              </Tag>
            )
          })}
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
