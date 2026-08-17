import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { Container } from '@/components/Container'

type Args = { params: Promise<{ slug: string }> }

export default async function ServiceDetailPage({ params }: Args) {
  const { slug } = await params
  const payload = await getCachedPayload()
  const result = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1 })
  const service = result.docs[0]
  if (!service) notFound()

  return (
    <article>
      <section className="relative flex h-[60vh] items-end bg-ink text-canvas">
        {service.heroImage?.url && (
          <Image src={service.heroImage.url} alt={service.heroImage.alt || service.title} fill className="object-cover opacity-50" />
        )}
        <Container className="relative pb-16">
          <p className="eyebrow mb-3 text-thread">Service</p>
          <h1 className="text-5xl md:text-6xl">{service.title}</h1>
        </Container>
      </section>

      <Container className="py-16">
        {service.body && (
          <RichText data={service.body} className="prose prose-headings:font-display prose-headings:uppercase max-w-2xl" />
        )}

        {service.gallery?.length ? (
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3">
            {service.gallery.map((item: any, i: number) => (
              <div key={i} className="relative aspect-square">
                {item.image?.url && <Image src={item.image.url} alt={item.image.alt || ''} fill className="object-cover" />}
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </article>
  )
}
