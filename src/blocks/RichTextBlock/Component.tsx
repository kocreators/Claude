import { RichText } from '@payloadcms/richtext-lexical/react'
import { Container } from '@/components/Container'

export function RichTextBlockComponent({ block }: { block: any }) {
  return (
    <section className="py-16">
      <Container className={block.width === 'narrow' ? 'max-w-3xl' : ''}>
        <RichText data={block.content} className="prose prose-headings:font-display prose-headings:uppercase max-w-none" />
      </Container>
    </section>
  )
}
