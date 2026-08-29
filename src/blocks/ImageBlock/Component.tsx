import Image from 'next/image'
import { Container } from '@/components/Container'

export function ImageBlockComponent({ block }: { block: any }) {
  const img = block.image
  if (typeof img !== 'object' || !img?.url) return null

  if (block.fit === 'contain') {
    return (
      <section className="py-4">
        <Container className={block.width === 'narrow' ? 'max-w-3xl' : ''}>
          <Image
            src={img.url}
            alt={img.alt || ''}
            width={img.width || 1600}
            height={img.height || 900}
            sizes="576px"
            quality={90}
            className="mx-auto h-auto w-full max-w-xl"
          />
        </Container>
      </section>
    )
  }

  return (
    <section className="py-4">
      <Container className={block.width === 'narrow' ? 'max-w-3xl' : ''}>
        <div className="relative mx-auto aspect-[16/9] w-full max-w-xl overflow-hidden">
          <Image src={img.url} alt={img.alt || ''} fill sizes="576px" quality={90} className="object-cover" />
        </div>
      </Container>
    </section>
  )
}
