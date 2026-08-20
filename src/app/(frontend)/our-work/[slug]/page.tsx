import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { Container } from '@/components/Container'

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
  return {
    title: project ? `${project.clientName} — Kocreators` : 'Our Work — Kocreators',
    description: project?.overview || undefined,
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

  return (
    <article>
      <section className="relative flex min-h-[70vh] items-end bg-ink text-canvas-light">
        {typeof project.coverImage === 'object' && project.coverImage?.url && (
          <Image
            src={project.coverImage.url}
            alt={project.coverImage.alt || project.clientName}
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <Container className="relative pb-16 pt-40">
          <p className="eyebrow mb-4">{project.industry || 'Case Study'}</p>
          <h1 className="max-w-3xl text-5xl leading-[0.95] md:text-7xl">{project.clientName}</h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-widest2 text-canvas-light/70">{project.projectType}</p>
        </Container>
      </section>

      <section className="bg-canvas-light py-20 md:py-28">
        <Container className="grid gap-14 md:grid-cols-[2fr_1fr]">
          <div className="space-y-14">
            {project.overview && (
              <div>
                <h2 className="mb-4 text-2xl">Overview</h2>
                <p className="max-w-2xl text-ink/70">{project.overview}</p>
              </div>
            )}
            {project.challenge && (
              <div>
                <h2 className="mb-4 text-2xl">The Challenge</h2>
                <p className="max-w-2xl text-ink/70">{project.challenge}</p>
              </div>
            )}
            {project.solution && (
              <div>
                <h2 className="mb-4 text-2xl">The Solution</h2>
                <p className="max-w-2xl text-ink/70">{project.solution}</p>
              </div>
            )}
            {project.resultsBody && (
              <div>
                <h2 className="mb-4 text-2xl">Results</h2>
                <RichText data={project.resultsBody} className="prose prose-headings:font-display prose-headings:uppercase max-w-2xl" />
              </div>
            )}
          </div>

          {services.length > 0 && (
            <div>
              <h3 className="eyebrow mb-4">Services Provided</h3>
              <ul className="space-y-2">
                {services.map((s: any) => (
                  <li key={s.id} className="border-b border-ink/10 pb-2 text-sm text-ink/80">
                    {s.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>

      {gallery.length > 0 && (
        <section className="bg-canvas py-16 md:py-20">
          <Container className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {gallery.map((item: any, i: number) => (
              <div key={i} className={`relative overflow-hidden ${i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}`}>
                {typeof item.image === 'object' && item.image?.url && (
                  <Image src={item.image.url} alt={item.image.alt || ''} fill sizes="80vw" className="object-cover" />
                )}
              </div>
            ))}
          </Container>
        </section>
      )}

      {testimonial?.quote && (
        <section className="bg-ink py-24 text-canvas-light md:py-32">
          <Container>
            <blockquote className="max-w-3xl">
              <p className="font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">&ldquo;{testimonial.quote}&rdquo;</p>
              <footer className="mt-6 font-mono text-xs uppercase tracking-widest2 text-canvas-light/60">
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
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5">
                    <p className="font-display text-lg uppercase tracking-tight text-canvas-light">{r.clientName}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-brand py-20 text-canvas-light md:py-24">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <h2 className="max-w-xl text-3xl md:text-4xl">Ready to make something like this?</h2>
          <Link href="/contact" className="btn-outline-light">
            Start a Project
          </Link>
        </Container>
      </section>
    </article>
  )
}
