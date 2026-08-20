import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

const styleMap: Record<string, string> = {
  dark: 'bg-ink text-canvas-light',
  light: 'bg-canvas text-ink',
  accent: 'bg-brand text-canvas-light',
}

const ctaVariant: Record<string, 'outline' | 'outline-light'> = {
  dark: 'outline-light',
  light: 'outline',
  accent: 'outline-light',
}

export function CTABannerBlock({ block }: { block: any }) {
  const style = block.style || 'dark'
  return (
    <section className={`py-24 md:py-32 ${styleMap[style]}`}>
      <Container className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div>
          <h2 className="max-w-xl text-4xl leading-[0.95] md:text-6xl">{block.heading}</h2>
          {block.subhead && <p className="mt-4 max-w-md opacity-80">{block.subhead}</p>}
        </div>
        {block.cta && <CTAButton link={block.cta} variant={ctaVariant[style]} />}
      </Container>
    </section>
  )
}
