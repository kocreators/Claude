import Image from 'next/image'
import { Container } from '@/components/Container'

export function TrustedBrandsBlock({ block }: { block: any }) {
  const logos = (block.logos || []) as any[]
  return (
    <section className="border-y border-ink/10 bg-canvas py-16">
      <Container>
        <p className="eyebrow mb-8 text-center">{block.heading}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 grayscale opacity-70">
          {logos.map((l: any, i: number) => (
            <div key={i} className="relative h-8 w-28">
              {typeof l.logo === 'object' && l.logo?.url && <Image src={l.logo.url} alt={l.name} fill className="object-contain" />}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
