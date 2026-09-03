import type { MetadataRoute } from 'next'
import { getCachedPayload } from '@/lib/getCachedPayload'

export const revalidate = 3600

const baseUrl = 'https://kocreators.com'

const STATIC_ROUTES = ['', '/services', '/our-work', '/blog']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))

  // This route is prerendered during `next build`, so anything thrown here
  // fails the whole build. Preview deployments don't get PAYLOAD_SECRET or
  // DATABASE_URI (they're Production-only), which made every preview build
  // die with "missing secret key" long before the page could render. A
  // sitemap missing its CMS-driven URLs for one build is a far smaller
  // problem than no deployment at all, so fall back to the static routes
  // and let the hourly revalidate pick up the full list once the
  // environment can actually reach Payload.
  let pages, services, projects, posts
  try {
    const payload = await getCachedPayload()
    ;[pages, services, projects, posts] = await Promise.all([
      payload.find({ collection: 'pages', limit: 200, depth: 0 }),
      payload.find({ collection: 'services', limit: 200, depth: 0 }),
      payload.find({ collection: 'projects', limit: 200, depth: 0 }),
      payload.find({ collection: 'posts', limit: 200, depth: 0 }),
    ])
  } catch (err) {
    console.error('Sitemap: could not load content from Payload, serving static routes only:', err)
    return staticEntries
  }

  const pageSlugs = new Set(pages.docs.map((p: any) => p.slug))
  const staticRoutes = STATIC_ROUTES.filter((route) => !pageSlugs.has(route.replace(/^\//, '')))

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
