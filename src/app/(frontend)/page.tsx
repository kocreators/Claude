import { notFound } from 'next/navigation'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { RenderBlocks } from '@/blocks/RenderBlocks'

// Homepage is just the Pages doc with slug "home" — same rendering path as
// every other page, so editors build it entirely from the block layout.
export default async function HomePage() {
  const payload = await getCachedPayload()
  const result = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
  const page = result.docs[0]

  if (!page) notFound()

  return <RenderBlocks blocks={page.layout as any[]} />
}
