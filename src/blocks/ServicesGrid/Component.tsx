import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { getCachedPayload } from '@/lib/getCachedPayload'

export async function ServicesGridBlock({ block }: { block: any }) {
  const payload = await getCachedPayload()

  let services: any[] = []
  if (block.source === 'manual' && block.services?.length) {
    services = block.services
  } else {
    const result = await payload.find({ collection: 'services', sort: 'order', limit: 12 })
    services = result.docs
  }

  return (
    <section className="bg-canvas-light py-24">
      <Container>
        <h2 className="mb-12 text-3xl md:text-4xl">{block.heading}</h2>
        <div className="grid grid-cols-2 gap-px overflow-hidden bg-ink/10 md:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group relative flex aspect-square flex-col justify-end bg-canvas-light p-6 transition-colors hover:bg-ink"
            >
              {service.heroImage?.url && (
                <Image
                  src={service.heroImage.url}
                  alt={service.heroImage.alt || service.title}
                  fill
                  className="absolute inset-0 object-cover opacity-0 transition-opacity group-hover:opacity-40"
                />
              )}
              <span className="relative font-display text-lg uppercase tracking-tight group-hover:text-canvas">
                {service.title}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
