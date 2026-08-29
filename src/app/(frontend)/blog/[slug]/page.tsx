import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { Container } from '@/components/Container'

export const revalidate = 60

type Args = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  const payload = await getCachedPayload()
  const result = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1 })
  return result.docs[0]
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: typeof post.coverImage === 'object' && post.coverImage?.url ? [{ url: post.coverImage.url }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Args) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <article className="py-20">
      <Container className="max-w-3xl">
        <h1 className="mb-6 text-4xl md:text-5xl">{post.title}</h1>
        {typeof post.coverImage === 'object' && post.coverImage?.url && (
          <div className="relative mb-10 aspect-video">
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        {post.content && <RichText data={post.content} className="prose prose-headings:font-extrabold prose-headings:uppercase max-w-none" />}
      </Container>
    </article>
  )
}
