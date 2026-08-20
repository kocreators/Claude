import Image from 'next/image'
import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

export function CompanyStoresBlock({ block }: { block: any }) {
  const headlineLines = String(block.heading || '').split('\n').filter(Boolean)
  const capabilities = (block.capabilities || []) as any[]
  const img = block.storeMockupImage

  return (
    <section className="bg-ink py-24 text-canvas-light md:py-32">
      <Container className="grid items-center gap-16 md:grid-cols-2">
        <div>
          {block.kicker && <p className="eyebrow mb-5">{block.kicker}</p>}
          <h2 className="mb-6 text-4xl leading-[0.95] md:text-5xl">
            {headlineLines.length > 0
              ? headlineLines.map((line: string, i: number) => <span key={i} className="block">{line}</span>)
              : block.heading}
          </h2>
          {block.body && <p className="mb-8 max-w-md text-canvas-light/75">{block.body}</p>}

          {capabilities.length > 0 && (
            <ul className="mb-10 grid grid-cols-2 gap-x-6 gap-y-3">
              {capabilities.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-canvas-light/85">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 bg-brand" />
                  {c.label}
                </li>
              ))}
            </ul>
          )}

          {block.cta && <CTAButton link={block.cta} variant="primary" />}
        </div>

        <div className="relative">
          {/* Simple browser-chrome frame around the store mockup image */}
          <div className="border border-canvas-light/15 bg-ink-soft">
            <div className="flex items-center gap-1.5 border-b border-canvas-light/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-canvas-light/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-canvas-light/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-canvas-light/20" />
            </div>
            <div className="relative aspect-[4/3]">
              {img?.url ? (
                <Image src={img.url} alt={img.alt || 'Example Kocreators brand store'} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-ink-soft" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
