import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// Portfolio / case-study collection — powers the "Our Work" grid on the
// homepage and /our-work, plus individual case-study pages at
// /our-work/[slug]. Kept separate from `services` (which is a catalog of
// what Kocreators offers) since a project is a specific piece of finished
// work, often spanning several services.
export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'clientName', defaultColumns: ['clientName', 'projectType', 'featured', '_status'] },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    { name: 'clientName', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Show on homepage Our Work grid' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'projectType', type: 'text', required: true, admin: { description: 'e.g. "Employee Kits", "Event Merchandise", "Embroidered Headwear"' } },
    { name: 'industry', type: 'text' },
    {
      name: 'servicesProvided',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'overview', type: 'textarea' },
    { name: 'challenge', type: 'textarea' },
    { name: 'solution', type: 'textarea' },
    { name: 'resultsBody', type: 'richText', editor: lexicalEditor({}) },
    {
      name: 'testimonial',
      type: 'relationship',
      relationTo: 'testimonials',
    },
    {
      name: 'relatedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      maxRows: 3,
    },
  ],
}
