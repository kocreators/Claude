import Image from 'next/image'
import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'

export function ProcessStepsBlock({ block }: { block: any }) {
  const steps = block.steps || []
  return (
    <section className="bg-canvas py-24 md:py-32">
      <Container>
        <h2 className="mb-14 max-w-2xl text-4xl leading-[0.95] md:text-6xl">{block.heading}</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step: any, i: number) => (
            <div key={i}>
              <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-ink/5">
                {typeof step.image === 'object' && step.image?.url && (
                  <Image src={step.image.url} alt={step.image.alt || step.title} fill sizes="25vw" className="object-cover" />
                )}
                <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center bg-brand font-mono text-sm text-canvas-light">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mb-2 font-display text-xl">{step.title}</h3>
              <p className="text-sm text-ink/70">{step.description}</p>
            </div>
          ))}
        </div>
        {block.cta && (
          <div className="mt-14">
            <CTAButton link={block.cta} variant="outline" />
          </div>
        )}
      </Container>
    </section>
  )
}
