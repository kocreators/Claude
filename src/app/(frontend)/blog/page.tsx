import Link from 'next/link'
import Image from 'next/image'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { Container } from '@/components/Container'

export default async function BlogIndexPage() {
  const payload = await getCachedPayload()
  const result = await payload.find({ collection: 'posts', sort: '-publishedDate', limit: 24 })

  return (
    <section className="py-20">
      <Container>
        <h1 className="mb-12 text-4xl md:text-5xl">Blog</h1>
        <div className="grid gap-10 md:grid-cols-3">
          {result.docs.map((post: any) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="relative mb-4 aspect-[4/3] overflow-hidden bg-ink/5">
                {typeof post.coverImage === 'object' && post.coverImage?.url && (
                  <Image src={post.coverImage.url} alt={post.coverImage.alt || post.title} fill className="object-cover transition-transform group-hover:scale-105" />
                )}
              </div>
              <h2 className="font-display text-xl uppercase group-hover:text-brand-dark">{post.title}</h2>
              {post.excerpt && <p className="mt-2 text-sm text-ink/60">{post.excerpt}</p>}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
