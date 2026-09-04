import type { MetadataRoute } from 'next'
import { getCachedPayload } from '@/lib/getCachedPayload'

export const revalidate = 3600

const baseUrl = 'https://kocreators.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getCachedPayload()

  const [pages, services, projects, posts] = await Promise.all([
    payload.find({ collection: 'pages', limit: 200, depth: 0 }),
    payload.find({ collection: 'services', limit: 200, depth: 0 }),
    payload.find({ collection: 'projects', limit: 200, depth: 0 }),
    payload.find({ collection: 'posts', limit: 200, depth: 0 }),
  ])

  const pageSlugs = new Set(pages.docs.map((p: any) => p.slug))
  const staticRoutes = ['', '/services', '/our-work', '/blog'].filter(
    (route) => !pageSlugs.has(route.replace(/^\//, '')),
  )

  const pageRoutes = pages.docs
    .filter((p: any) => p.slug !== 'home')
    .map((p: any) => ({ url: `${baseUrl}/${p.slug}`, lastModified: p.updatedAt }))

  const serviceRoutes = services.docs.map((s: any) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: s.updatedAt,
  }))

  const projectRoutes = projects.docs.map((p: any) => ({
    url: `${baseUrl}/our-work/${p.slug}`,
    lastModified: p.updatedAt,
  }))

  const postRoutes = posts.docs.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }))

  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date() })),
    ...pageRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...postRoutes,
  ]
}
