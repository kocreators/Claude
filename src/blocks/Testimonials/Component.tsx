import { Container } from '@/components/Container'

export function TestimonialsBlockComponent({ block }: { block: any }) {
  const items = (block.items || []) as any[]
  if (!items.length) return null

  return (
    <section className="bg-ink py-24 text-canvas">
      <Container>
        <h2 className="mb-12 text-3xl md:text-4xl">{block.heading}</h2>
        <div className="grid gap-10 md:grid-cols-2">
          {items.map((t: any) => (
            <blockquote key={t.id} className="border-l-2 border-thread pl-6">
              <p className="mb-4 text-lg leading-relaxed text-canvas/90">&ldquo;{t.quote}&rdquo;</p>
              <footer className="font-mono text-xs uppercase tracking-widest2 text-canvas/50">
                {t.authorName}
                {t.authorTitle ? ` — ${t.authorTitle}` : ''}
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  )
}
