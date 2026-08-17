import { notFound } from 'next/navigation'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { Container } from '@/components/Container'

type Args = { params: Promise<{ slug: string }> }

export default async function BlogPostPage({ params }: Args) {
  const { slug } = await params
  const payload = await getCachedPayload()
  const result = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1 })
  const post = result.docs[0]
  if (!post) notFound()

  return (
    <article className="py-20">
      <Container className="max-w-3xl">
        <h1 className="mb-6 text-4xl md:text-5xl">{post.title}</h1>
        {post.coverImage?.url && (
          <div className="relative mb-10 aspect-video">
            <Image src={post.coverImage.url} alt={post.coverImage.alt || post.title} fill className="object-cover" />
          </div>
        )}
        {post.content && <RichText data={post.content} className="prose prose-headings:font-display prose-headings:uppercase max-w-none" />}
      </Container>
    </article>
  )
}
