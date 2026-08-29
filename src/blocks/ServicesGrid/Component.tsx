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
    <section className="bg-canvas-light py-10 md:py-32">
      <Container>
        <h2 className="mb-14 max-w-3xl text-4xl leading-[0.95] md:text-6xl">{block.heading}</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.landingPageUrl || `/services/${service.slug}`}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden bg-ink"
            >
              {typeof service.heroImage === 'object' && service.heroImage?.url ? (
                <Image
                  src={service.heroImage.url}
                  alt={service.heroImage.alt || service.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="absolute inset-0 object-cover opacity-80 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:opacity-90"
                />
              ) : (
                <div className="absolute inset-0 bg-ink-soft" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent" />

              <div className="relative p-4 md:p-6">
                <span className="block break-words text-base font-extrabold uppercase leading-[1.15] tracking-[-0.02em] text-canvas-light md:text-lg lg:text-2xl">
                  {service.title}
                </span>
                {service.summary && (
                  <span className="mt-2 hidden max-w-[22ch] text-sm text-canvas-light/70 md:line-clamp-2 md:block">
                    {service.summary}
                  </span>
                )}
                <span className="eyebrow mt-3 hidden transition-opacity duration-300 md:inline-block md:opacity-0 md:group-hover:opacity-100">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
