import Image from 'next/image'
import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

export function CompanyStoresBlock({ block }: { block: any }) {
  const headlineLines = String(block.heading || '').split('\n').filter(Boolean)
  const capabilities = (block.capabilities || []) as any[]
  const img = block.storeMockupImage
  const mobileImg = block.storeMockupMobileImage

  return (
    <section className="bg-ink py-10 text-canvas-light md:py-32">
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

        <div>
        <div className="relative pb-14 pr-8 md:pb-20 md:pr-14">
          {/* Computer monitor frame around the desktop store screenshot */}
          <div className="overflow-hidden rounded-lg border-[10px] border-b-0 border-[#1c1c1c] bg-[#1c1c1c] shadow-2xl">
            <div className="flex items-center gap-1.5 bg-[#1c1c1c] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-canvas-light/25" />
              <span className="h-2.5 w-2.5 rounded-full bg-canvas-light/25" />
              <span className="h-2.5 w-2.5 rounded-full bg-canvas-light/25" />
            </div>
            <div className="relative aspect-[16/9] bg-ink-soft">
              {img?.url ? (
                <Image
                  src={img.url}
                  alt={img.alt || 'Example Kocreators brand store'}
                  fill
                  sizes="(min-width: 768px) 40vw, 90vw"
                  quality={90}
                  className="object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 bg-ink-soft" />
              )}
            </div>
          </div>
          {/* Monitor stand */}
          <div className="mx-auto h-4 w-20 bg-gradient-to-b from-[#1c1c1c] to-[#111]" />
          <div className="mx-auto h-2 w-40 rounded-b-md bg-[#111]" />

          {/* Phone frame with the mobile store screenshot, overlapping the monitor.
              A true phone ratio (9:19.5) here, not the screenshot's own wider ratio —
              object-contain fits the whole screenshot inside without cropping it. */}
          <div className="absolute -bottom-2 -right-2 w-[34%] max-w-[160px] md:-right-6">
            <div className="relative rounded-[1.75rem] border-[6px] border-[#1c1c1c] bg-[#1c1c1c] shadow-2xl">
              <div className="absolute left-1/2 top-0 z-10 h-4 w-14 -translate-x-1/2 rounded-b-lg bg-[#1c1c1c]" />
              <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.35rem] bg-canvas-light">
                {mobileImg?.url ? (
                  <Image
                    src={mobileImg.url}
                    alt={mobileImg.alt || 'Example Kocreators brand store on mobile'}
                    fill
                    sizes="180px"
                    quality={90}
                    className="object-contain object-top"
                  />
                ) : (
                  <div className="absolute inset-0 bg-ink-soft" />
                )}
              </div>
            </div>
          </div>
        </div>

        {block.previewCta && (
          <div className="mt-8 text-center">
            <CTAButton link={block.previewCta} variant="primary" />
          </div>
        )}
        </div>
      </Container>
    </section>
  )
}
