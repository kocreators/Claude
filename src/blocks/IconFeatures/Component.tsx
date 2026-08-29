import Image from 'next/image'
import { Container } from '@/components/Container'

export function IconFeaturesBlock({ block }: { block: any }) {
  const items = (block.items || []) as any[]
  if (!items.length) return null

  return (
    <section className="bg-canvas-light py-20">
      <Container>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div key={i}>
              {typeof item.icon === 'object' && item.icon?.url && (
                <Image
                  src={item.icon.url}
                  alt=""
                  width={28}
                  height={28}
                  className="mb-2 h-7 w-7 object-contain"
                />
              )}
              <span className="mb-3 block h-1.5 w-8 bg-brand" />
              <h3 className="mb-2 text-xl">{item.label}</h3>
              {item.description && <p className="text-sm text-ink/70">{item.description}</p>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
