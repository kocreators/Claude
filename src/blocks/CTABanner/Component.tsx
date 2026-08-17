import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

const styleMap: Record<string, string> = {
  dark: 'bg-ink text-canvas',
  light: 'bg-canvas text-ink',
  accent: 'bg-thread text-ink',
}

export function CTABannerBlock({ block }: { block: any }) {
  return (
    <section className={`py-24 ${styleMap[block.style || 'dark']}`}>
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div>
          <h2 className="max-w-xl text-3xl md:text-4xl">{block.heading}</h2>
          {block.subhead && <p className="mt-3 max-w-md opacity-70">{block.subhead}</p>}
        </div>
        {block.cta?.link && <CTAButton link={block.cta.link} variant={block.style === 'light' ? 'outline' : 'outline-light'} />}
      </Container>
    </section>
  )
}
