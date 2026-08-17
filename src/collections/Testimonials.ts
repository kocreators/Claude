import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'authorName' },
  access: { read: () => true },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'authorName', type: 'text', required: true },
    { name: 'authorTitle', type: 'text', admin: { description: 'e.g. "Head Coach, Peoria United"' } },
    { name: 'authorPhoto', type: 'upload', relationTo: 'media' },
  ],
}
