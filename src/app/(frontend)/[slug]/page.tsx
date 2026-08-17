import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { RenderBlocks } from '@/blocks/RenderBlocks'

// Generic renderer for every top-level marketing page created in the admin:
// /services, /work, /process, /about, /trusted-brands, /support, /contact...
type Args = { params: Promise<{ slug: string }> }

async function getPage(slug: string) {
  const payload = await getCachedPayload()
  const result = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
  return result.docs[0]
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  return {
    title: page?.meta?.title || page?.title || 'Kocreators',
    description: page?.meta?.description || undefined,
  }
}

export default async function GenericPage({ params }: Args) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  return <RenderBlocks blocks={page.layout as any[]} />
}
