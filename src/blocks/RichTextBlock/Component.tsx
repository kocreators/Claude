import { RichText } from '@payloadcms/richtext-lexical/react'
import { Container } from '@/components/Container'

export function RichTextBlockComponent({ block }: { block: any }) {
  return (
    <section className="py-8">
      <Container className={block.width === 'narrow' ? 'max-w-3xl' : ''}>
        {block.eyebrow && <p className="eyebrow mb-4 text-brand">{block.eyebrow}</p>}
        <RichText data={block.content} className="prose max-w-none" />
      </Container>
    </section>
  )
}
