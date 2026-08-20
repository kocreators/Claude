import Image from 'next/image'
import { Container } from '@/components/Container'

export function TestimonialsBlockComponent({ block }: { block: any }) {
  const items = (block.items || []) as any[]
  if (!items.length) return null

  return (
    <section className="bg-ink py-24 text-canvas-light md:py-32">
      <Container>
        {block.heading && <p className="eyebrow mb-14">{block.heading}</p>}
        <div className="divide-y divide-canvas-light/10">
          {items.map((t: any) => (
            <blockquote key={t.id} className="grid gap-8 py-16 first:pt-0 last:pb-0 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-3xl font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest2 text-canvas-light/60 md:flex-col md:items-end md:text-right">
                {typeof t.authorPhoto === 'object' && t.authorPhoto?.url && (
                  <span className="relative h-12 w-12 overflow-hidden">
                    <Image src={t.authorPhoto.url} alt={t.authorName} fill className="object-cover" />
                  </span>
                )}
                <span>
                  {t.authorName}
                  {t.authorTitle ? <><br />{t.authorTitle}</> : null}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  )
}
