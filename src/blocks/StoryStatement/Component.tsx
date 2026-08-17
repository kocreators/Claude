import Image from 'next/image'
import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

export function StoryStatementBlock({ block }: { block: any }) {
  return (
    <section className="bg-canvas-light py-24">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <div>
          {block.kicker && <p className="eyebrow mb-4">{block.kicker}</p>}
          <h2 className="mb-6 text-3xl md:text-4xl">{block.heading}</h2>
          {block.body && <p className="mb-8 max-w-md text-ink/70">{block.body}</p>}
          {block.cta?.link && <CTAButton link={block.cta.link} variant="outline" />}
        </div>
        <div className="relative aspect-[4/3] overflow-hidden">
          {block.image?.url && (
            <Image src={block.image.url} alt={block.image.alt || block.heading} fill className="object-cover" />
          )}
        </div>
      </Container>
    </section>
  )
}
