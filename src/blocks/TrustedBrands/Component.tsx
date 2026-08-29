import Image from 'next/image'
import { Container } from '@/components/Container'

export function TrustedBrandsBlock({ block }: { block: any }) {
  const logos = (block.logos || []) as any[]
  if (!logos.length) return null

  const scale = block.logoScale || 1
  // Mobile boxes fill their grid column (avoids fixed-width overflow into
  // the neighboring logo at larger scales); sm+ uses the fixed scaled size.
  const boxVars = { ['--logo-w' as any]: `${140 * scale}px`, ['--logo-h' as any]: `${40 * scale}px` }
  const boxClass = 'relative h-[--logo-h] w-full max-w-[220px] sm:w-[--logo-w]'

  return (
    <section className="border-y border-ink/10 bg-canvas py-4">
      <Container>
        <p className="eyebrow mb-8 text-center">{block.heading}</p>
        <div className="grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-8 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-14">
          {logos.map((l: any, i: number) => {
            const image = typeof l.logo === 'object' && l.logo?.url && (
              <Image src={l.logo.url} alt={l.name} fill className="object-contain" />
            )
            return l.url ? (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className={`group ${boxClass}`} style={boxVars}>
                <div className="absolute inset-0 grayscale opacity-70 transition-all duration-200 group-hover:grayscale-0 group-hover:opacity-100">
                  {image}
                </div>
              </a>
            ) : (
              <div key={i} className={`${boxClass} grayscale opacity-70`} style={boxVars}>
                {image}
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
