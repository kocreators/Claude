import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { CTAButton } from '@/components/CTAButton'
import { getCachedPayload } from '@/lib/getCachedPayload'

// Asymmetric editorial portfolio grid — first item spans two columns to
// break the uniform card-grid feel and signal "agency portfolio," not
// "product catalog." Hover reveals client / project type / View Project.
export async function PortfolioGridBlock({ block }: { block: any }) {
  const payload = await getCachedPayload()

  let projects: any[] = []
  if (block.source === 'manual' && block.projects?.length) {
    projects = block.projects
  } else {
    const result = await payload.find({
      collection: 'projects',
      where: { featured: { equals: true } },
      sort: 'order',
      limit: block.limit || 6,
    })
    projects = result.docs
  }

  if (!projects.length) return null

  return (
    <section className="bg-canvas-light py-24 md:py-32">
      <Container>
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-4xl leading-[0.95] md:text-6xl">{block.heading}</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Link
              key={project.id}
              href={`/our-work/${project.slug}`}
              className={`group relative block overflow-hidden bg-ink ${i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}`}
            >
              {typeof project.coverImage === 'object' && project.coverImage?.url && (
                <Image
                  src={project.coverImage.url}
                  alt={project.coverImage.alt || project.clientName}
                  fill
                  sizes={i === 0 ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/0 to-ink/0 opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

              <div className="absolute inset-x-0 bottom-0 flex translate-y-2 flex-col items-start px-6 pb-1 pt-6 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:px-8 md:pb-2 md:pt-8">
                <div className="-ml-5 inline-flex flex-col items-start gap-1 bg-[rgba(8,12,11,0.88)] px-5 py-4 backdrop-blur-[6px]">
                  <p className="text-xl font-extrabold uppercase leading-[1.15] tracking-[-0.02em] text-canvas-light md:text-2xl">
                    {project.clientName}
                  </p>
                  <p className="eyebrow tracking-[0.08em] text-[#2fa98e]">{project.projectType}</p>
                </div>
                <span className="label mt-3 inline-flex items-center gap-2 text-canvas-light opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  View Project →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {block.cta && (
          <div className="mt-14">
            <CTAButton link={block.cta} variant="outline" />
          </div>
        )}
      </Container>
    </section>
  )
}
