import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { Container } from '@/components/Container'

export const revalidate = 60

type Args = { params: Promise<{ slug: string }> }

async function getProject(slug: string) {
  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return result.docs[0]
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}

  const title = (project as any).meta?.title || project.clientName
  const description = (project as any).meta?.description || project.overview || undefined
  const image = (project as any).meta?.image || project.coverImage

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

export default async function CaseStudyPage({ params }: Args) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const services = (project.servicesProvided || []) as any[]
  const gallery = (project.gallery || []) as any[]
  const related = (project.relatedProjects || []) as any[]
  const testimonial = project.testimonial as any
  const whatWeDid = (project.whatWeDidItems || []) as any[]

  return (
    <article>
      <section className="relative flex min-h-[50vh] items-end bg-ink text-canvas-light md:min-h-[70vh]">
        {typeof project.coverImage === 'object' && project.coverImage?.url && (
          <Image
            src={project.coverImage.url}
            alt={project.coverImage.alt || project.clientName}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="absolute inset-0 object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <Container className="relative pb-8 pt-20 md:pb-16 md:pt-40">
          <p className="eyebrow mb-4">{project.industry || 'Case Study'}</p>
          <h1 className="max-w-3xl text-5xl leading-[0.95] md:text-7xl">{project.clientName}</h1>
          <p className="label mt-4 text-canvas-light/70">{project.projectType}</p>
        </Container>
      </section>

      <section className="bg-canvas-light py-20 md:py-28">
        <Container className="mx-auto max-w-3xl">
          {(project.projectHeading || project.overview) && (
            <div>
              <p className="eyebrow mb-4">The Project</p>
              {project.projectHeading && <h2 className="mb-6 text-3xl leading-[1.05] md:text-4xl">{project.projectHeading}</h2>}
              {project.overview && <p className="whitespace-pre-line text-ink/70">{project.overview}</p>}
              {services.length > 0 && (
                <p className="mt-6 text-sm text-ink/50">
                  <span className="eyebrow mr-2 text-ink/40">Services Provided</span>
                  {services.map((s: any) => s.title).join(' · ')}
                </p>
              )}
            </div>
          )}

          {whatWeDid.length > 0 && (
            <div className="mt-20">
              <p className="eyebrow mb-10">What We Did</p>
              <div className="space-y-14">
                {whatWeDid.map((item: any, i: number) => (
                  <div key={i}>
                    <span className="mb-3 block h-1.5 w-8 bg-brand" />
                    <h3 className="mb-2 text-xl">{item.title}</h3>
                    {item.description && <p className="text-ink/70">{item.description}</p>}
                    {typeof item.image === 'object' && item.image?.url && (
                      <div className="relative mx-auto mt-6 aspect-[16/9] w-full max-w-xl overflow-hidden">
                        <Image src={item.image.url} alt={item.image.alt || ''} fill sizes="576px" quality={90} className="object-cover" />
                      </div>
                    )}
                    {typeof item.desktopMockupImage === 'object' && item.desktopMockupImage?.url && (
                      <div className="relative mx-auto mt-8 max-w-xl pb-14 pr-8 md:pb-20 md:pr-14">
                        <div className="overflow-hidden rounded-lg border-[10px] border-b-0 border-[#1c1c1c] bg-[#1c1c1c] shadow-2xl">
                          <div className="flex items-center gap-1.5 bg-[#1c1c1c] px-4 py-2.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-canvas-light/25" />
                            <span className="h-2.5 w-2.5 rounded-full bg-canvas-light/25" />
                            <span className="h-2.5 w-2.5 rounded-full bg-canvas-light/25" />
                          </div>
                          <div className="relative aspect-[16/9] bg-ink-soft">
                            <Image
                              src={item.desktopMockupImage.url}
                              alt={item.desktopMockupImage.alt || ''}
                              fill
                              sizes="576px"
                              quality={90}
                              className="object-cover object-top"
                            />
                          </div>
                        </div>
                        <div className="mx-auto h-4 w-20 bg-gradient-to-b from-[#1c1c1c] to-[#111]" />
                        <div className="mx-auto h-2 w-40 rounded-b-md bg-[#111]" />

                        {typeof item.mobileMockupImage === 'object' && item.mobileMockupImage?.url && (
                          <div className="absolute -bottom-2 -right-2 w-[34%] max-w-[160px] md:-right-6">
                            <div className="relative rounded-[1.75rem] border-[6px] border-[#1c1c1c] bg-[#1c1c1c] shadow-2xl">
                              <div className="absolute left-1/2 top-0 z-10 h-4 w-14 -translate-x-1/2 rounded-b-lg bg-[#1c1c1c]" />
                              <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.35rem] bg-canvas-light">
                                <Image
                                  src={item.mobileMockupImage.url}
                                  alt={item.mobileMockupImage.alt || ''}
                                  fill
                                  sizes="180px"
                                  quality={90}
                                  className="object-contain object-top"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {gallery.map((item: any, i: number) =>
            typeof item.image === 'object' && item.image?.url ? (
              <div key={i} className="relative mx-auto my-16 aspect-[16/9] w-full max-w-xl overflow-hidden">
                <Image src={item.image.url} alt={item.image.alt || ''} fill sizes="576px" quality={90} className="object-cover" />
              </div>
            ) : null,
          )}

          {(project.resultHeading || project.resultsBody) && (
            <div className="mt-20">
              <p className="eyebrow mb-4">The Result</p>
              {project.resultHeading && <h2 className="mb-6 text-3xl leading-[1.05] md:text-4xl">{project.resultHeading}</h2>}
              {project.resultsBody && (
                <RichText data={project.resultsBody} className="prose prose-p:text-ink/70" />
              )}
            </div>
          )}

          {typeof project.closingImage === 'object' && project.closingImage?.url && (
            <div className="relative mx-auto mt-16 aspect-square w-full max-w-xl overflow-hidden">
              <Image src={project.closingImage.url} alt={project.closingImage.alt || ''} fill sizes="576px" quality={90} className="object-cover" />
            </div>
          )}
        </Container>
      </section>

      {testimonial?.quote && (
        <section className="bg-ink py-24 text-canvas-light md:py-32">
          <Container>
            <blockquote className="max-w-3xl">
              <p className="text-3xl font-extrabold uppercase leading-[1.1] tracking-tight md:text-5xl">&ldquo;{testimonial.quote}&rdquo;</p>
              <footer className="label mt-6 text-canvas-light/60">
                {testimonial.authorName}
                {testimonial.authorTitle ? ` — ${testimonial.authorTitle}` : ''}
              </footer>
            </blockquote>
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-canvas-light py-20 md:py-24">
          <Container>
            <h2 className="mb-10 text-3xl">More Work</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r: any) => (
                <Link key={r.id} href={`/our-work/${r.slug}`} className="group relative block aspect-[4/3] overflow-hidden bg-ink">
                  {typeof r.coverImage === 'object' && r.coverImage?.url && (
                    <Image
                      src={r.coverImage.url}
                      alt={r.coverImage.alt || r.clientName}
                      fill
                      sizes="33vw"
                      quality={90}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5">
                    <p className="text-lg font-extrabold uppercase tracking-tight text-canvas-light">{r.clientName}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-brand py-20 text-canvas-light md:py-24">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <h2 className="max-w-xl text-3xl md:text-4xl">Ready to put your brand on something great?</h2>
          <Link href="/start" className="btn-outline-light">
            Start a Project
          </Link>
        </Container>
      </section>
    </article>
  )
}
