import Image from 'next/image'
import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

export function ProcessStepsBlock({ block }: { block: any }) {
  const steps = block.steps || []
  return (
    <section className="bg-canvas py-24">
      <Container>
        <h2 className="mb-14 text-3xl md:text-4xl">{block.heading}</h2>
        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step: any, i: number) => (
            <div key={i}>
              <div className="relative mb-5 aspect-[4/3] overflow-hidden bg-ink/5">
                {step.image?.url && (
                  <Image src={step.image.url} alt={step.image.alt || step.title} fill className="object-cover" />
                )}
                <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center bg-thread font-mono text-sm text-ink">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mb-2 font-display text-xl">{step.title}</h3>
              <p className="text-sm text-ink/70">{step.description}</p>
            </div>
          ))}
        </div>
        {block.cta?.link && (
          <div className="mt-12">
            <CTAButton link={block.cta.link} variant="outline" />
          </div>
        )}
      </Container>
    </section>
  )
}
