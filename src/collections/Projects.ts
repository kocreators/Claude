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
      name: 'meta',
      type: 'group',
      admin: { position: 'sidebar', description: 'SEO — leave blank to fall back to clientName/overview/coverImage' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
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
    { name: 'projectHeading', type: 'text', admin: { description: '"The Project" section headline, e.g. "Custom Stadium Cups for Dr Pepper"' } },
    { name: 'overview', type: 'textarea', admin: { description: '"The Project" section body' } },
    { name: 'challenge', type: 'textarea', admin: { description: 'Legacy field, no longer rendered — kept temporarily during template migration' } },
    { name: 'solution', type: 'textarea', admin: { description: 'Legacy field, no longer rendered — kept temporarily during template migration' } },
    {
      name: 'whatWeDidItems',
      type: 'array',
      admin: { description: '"What We Did" section — one card per step/scope item' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Optional supporting photo shown with this item' } },
        {
          name: 'desktopMockupImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional — shows a monitor + phone device mockup instead of a plain photo (pair with mobileMockupImage)' },
        },
        { name: 'mobileMockupImage', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'resultHeading', type: 'text', admin: { description: '"The Result" section headline, e.g. "One Partner. Start to Finish."' } },
    { name: 'resultsBody', type: 'richText', editor: lexicalEditor({}), admin: { description: '"The Result" section body' } },
    { name: 'closingImage', type: 'upload', relationTo: 'media', admin: { description: 'Optional square supporting image shown below "The Result" section' } },
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
