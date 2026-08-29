import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

export function PricingTiersBlock({ block }: { block: any }) {
  const tiers = (block.tiers || []) as any[]
  if (!tiers.length) return null

  return (
    <section className="bg-brand py-20 text-canvas-light">
      <Container>
        {block.heading && <p className="eyebrow mb-10 text-center text-canvas-light">{block.heading}</p>}
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {tiers.map((tier, i) => (
            <div key={i} className="flex flex-col items-center bg-canvas-light p-8 text-center text-ink">
              <p className="label mb-3 text-ink/50">{tier.name}</p>
              {tier.description && <p className="mb-6 text-sm text-ink/70">{tier.description}</p>}
              <p className="mb-6 text-4xl font-extrabold">{tier.priceLabel}</p>
              {tier.cta && <CTAButton link={tier.cta} variant="primary" />}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
