type InternalDoc = { relationTo: string; value: { slug?: string } | string }

type LinkData = {
  type?: 'internal' | 'custom'
  label?: string
  url?: string
  newTab?: boolean
  internal?: InternalDoc | InternalDoc[] | null
} | null | undefined

const collectionPathMap: Record<string, string> = {
  pages: '',
  services: '/services',
  posts: '/blog',
  projects: '/our-work',
}

// Turns a Payload "link" field group (see src/fields/link.ts) into a plain
// { href, label, target } the frontend components can render directly.
export function resolveLink(link: LinkData) {
  if (!link) return { href: '#', label: '', target: undefined }

  if (link.type === 'custom') {
    return {
      href: link.url || '#',
      label: link.label || link.url || '',
      target: link.newTab ? '_blank' : undefined,
    }
  }

  const doc = Array.isArray(link.internal) ? link.internal[0] : link.internal
  const value = doc && typeof doc === 'object' ? doc.value : undefined
  const slug = value && typeof value === 'object' ? value.slug : undefined
  const relationTo = doc && typeof doc === 'object' ? doc.relationTo : 'pages'
  const base = collectionPathMap[relationTo] ?? ''
  const href = slug ? (slug === 'home' ? '/' : `${base}/${slug}`) : '#'

  return { href, label: link.label || '', target: link.newTab ? '_blank' : undefined }
}
