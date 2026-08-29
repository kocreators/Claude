import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { Container } from '@/components/Container'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Our Work',
  description: 'Real custom apparel, embroidery, promotional products, branded stores, and merchandise Kocreators has produced for teams, schools, and businesses.',
}

export default async function OurWorkPage() {
  const payload = await getCachedPayload()
  const result = await payload.find({ collection: 'projects', sort: 'order', limit: 100 })
  const projects = result.docs

  return (
    <article>
      <section className="bg-ink py-24 text-canvas-light md:py-32">
        <Container>
          <p className="eyebrow mb-5">Our Work</p>
          <h1 className="max-w-3xl text-5xl leading-[0.95] md:text-7xl">We make good brands look even better.</h1>
        </Container>
      </section>

      <section className="bg-canvas-light py-16 md:py-20">
        <Container>
          {projects.length === 0 ? (
            <p className="text-ink/60">Projects coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project: any) => (
                <Link
                  key={project.id}
                  href={`/our-work/${project.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden bg-ink"
                >
                  {typeof project.coverImage === 'object' && project.coverImage?.url && (
                    <Image
                      src={project.coverImage.url}
                      alt={project.coverImage.alt || project.clientName}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/0 to-ink/0 opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <div className="inline-flex max-w-full flex-col items-start gap-1 bg-[rgba(8,12,11,0.88)] px-4 py-3 backdrop-blur-[6px]">
                      <p className="eyebrow text-xs leading-tight text-[#2fa98e] sm:text-sm">{project.projectType}</p>
                      <p className="text-base font-extrabold uppercase leading-tight tracking-tight text-canvas-light sm:text-xl">
                        {project.clientName}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </article>
  )
}
