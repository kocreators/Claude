import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'
import { TrustedBrandsBlock } from '@/blocks/TrustedBrands/Component'
import { CTABannerBlock } from '@/blocks/CTABanner/Component'
import { PromoSpotlightBlock } from '@/blocks/PromoSpotlight/Component'
import { FaqAccordion } from '@/components/FaqAccordion'

type Args = { params: Promise<{ slug: string }> }

async function getService(slug: string) {
  const payload = await getCachedPayload()
  const result = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1 })
  return result.docs[0]
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return {}

  const title = (service as any).meta?.title || service.title
  const description = (service as any).meta?.description || service.summary || undefined
  const image = (service as any).meta?.image || service.heroImage

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: typeof image === 'object' && image?.url ? [{ url: image.url }] : undefined,
    },
  }
}

export default async function ServiceDetailPage({ params }: Args) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()

  const features = (service.features || []) as any[]
  const productCategories = (service.productCategories || []) as any[]
  const processSteps = (service.processSteps || []) as any[]
  const gallery = (service.gallery || []) as any[]
  const partnerBrands = (service.partnerBrands || []) as any[]
  const catalogItems = (service.catalogItems || []) as any[]

  const processStepsSection = processSteps.length > 0 && (
    <section className="bg-canvas-light py-5">
      <Container>
        <p className="eyebrow mb-5">How It Works</p>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <div key={i}>
              <span className="mb-4 flex h-9 w-9 items-center justify-center bg-brand font-mono text-sm font-bold text-canvas-light">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mb-2 text-xl">{step.title}</h3>
              {step.description && <p className="text-sm text-ink/70">{step.description}</p>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )

  const secondaryImageSection = typeof service.secondaryImage === 'object' && service.secondaryImage?.url && (
    <Container className="py-4">
      <div className="relative aspect-[21/9] w-full overflow-hidden">
        <Image
          src={service.secondaryImage.url}
          alt={service.secondaryImage.alt || ''}
          fill
          sizes="100vw"
          quality={90}
          className="object-cover"
        />
        {service.secondaryImageCta && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <CTAButton link={service.secondaryImageCta} variant="glass" />
            </div>
          </>
        )}
      </div>
    </Container>
  )

  return (
    <article>
      <section className="relative flex h-[60vh] items-end bg-ink text-canvas-light">
        {typeof service.heroImage === 'object' && service.heroImage?.url && (
          <Image src={service.heroImage.url} alt={service.heroImage.alt || service.title} fill className="object-cover opacity-50" />
        )}
        <Container className="relative pb-16">
          <p className="eyebrow mb-5 inline-block bg-[rgba(8,12,11,0.45)] px-3 py-1.5 tracking-[0.08em] text-[#2fa98e] backdrop-blur-[6px]">
            Service
          </p>
          <h1 className="text-5xl md:text-6xl">{service.title}</h1>
          {service.heroCta && (
            <div className="mt-8">
              <CTAButton link={service.heroCta} variant="primary" />
            </div>
          )}
        </Container>
      </section>

      <div className="h-4 bg-canvas-light" />

      {catalogItems.length > 0 && (
        <PromoSpotlightBlock block={{ heading: service.catalogHeading, items: catalogItems }} />
      )}

      {service.body && (
        <Container className="py-4">
          <RichText data={service.body} className="prose prose-headings:font-extrabold prose-headings:uppercase max-w-2xl" />
        </Container>
      )}

      {features.length > 0 && (
        <section className="bg-canvas py-5">
          <Container>
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <div key={i}>
                  {typeof f.icon === 'object' && f.icon?.url && (
                    <Image
                      src={f.icon.url}
                      alt=""
                      width={28}
                      height={28}
                      className="mb-2 h-7 w-7 object-contain"
                    />
                  )}
                  <span className="mb-3 block h-1.5 w-8 bg-brand" />
                  <h3 className="mb-2 text-xl">{f.label}</h3>
                  {f.description && <p className="text-sm text-ink/70">{f.description}</p>}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {productCategories.length > 0 && (
        <section className="bg-ink py-5 text-canvas-light">
          <Container>
            <p className="eyebrow mb-5">Product Categories</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {productCategories.map((cat, i) => {
                const Tag = cat.url ? 'a' : 'div'
                const linkProps = cat.url ? { href: cat.url, target: '_blank', rel: 'noopener noreferrer' } : {}
                return (
                  <Tag key={i} {...linkProps} className="group relative aspect-[3/4] overflow-hidden bg-ink-soft">
                    {typeof cat.image === 'object' && cat.image?.url ? (
                      <Image
                        src={cat.image.url}
                        alt={cat.image.alt || cat.name}
                        fill
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-ink-soft" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <span className="block text-lg font-extrabold uppercase leading-tight tracking-tight text-canvas-light">
                        {cat.name}
                      </span>
                    </div>
                  </Tag>
                )
              })}
            </div>
          </Container>
        </section>
      )}

      {service.secondaryImageBeforeSteps ? (
        <>
          {secondaryImageSection}
          {processStepsSection}
        </>
      ) : (
        <>
          {processStepsSection}
          {secondaryImageSection}
        </>
      )}

      {gallery.length === 1 && typeof gallery[0].image === 'object' && gallery[0].image?.url && (
        <Container className="py-4">
          <div className="relative aspect-[21/9] w-full overflow-hidden">
            <Image src={gallery[0].image.url} alt={gallery[0].image.alt || ''} fill sizes="100vw" quality={90} className="object-cover" />
          </div>
        </Container>
      )}

      {gallery.length > 1 && (
        <Container className="py-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {gallery.map((item, i) => (
              <div key={i} className="relative aspect-square">
                {typeof item.image === 'object' && item.image?.url && (
                  <Image src={item.image.url} alt={item.image.alt || ''} fill className="object-cover" />
                )}
              </div>
            ))}
          </div>
        </Container>
      )}

      <TrustedBrandsBlock block={{ heading: 'Brands We Work With', logos: partnerBrands }} />

      <FaqAccordion
        eyebrow={service.faqEyebrow}
        heading={service.faqHeading}
        note={service.faqNote}
        noteLink={service.faqNoteLink}
        items={(service.faqItems || []) as any[]}
      />

      {service.ctaHeading && (
        <CTABannerBlock
          block={{ heading: service.ctaHeading, subhead: service.ctaSubhead, cta: service.cta, style: 'accent' }}
        />
      )}

      {!service.ctaHeading && (
        <section className="bg-ink py-5 text-center text-canvas-light">
          <Container>
            <h2 className="mx-auto max-w-xl text-4xl leading-[0.95] md:text-5xl">Ready to start your project?</h2>
            <div className="mt-8 flex justify-center">
              <CTAButton link={{ type: 'custom', label: 'Start a Project', url: '/start' }} variant="primary" />
            </div>
          </Container>
        </section>
      )}
    </article>
  )
}
