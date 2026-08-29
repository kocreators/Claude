import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { linkField } from '@/fields/link'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'order', '_status'] },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'summary', type: 'textarea', admin: { description: 'Short line shown on grid cards' } },
    {
      name: 'meta',
      type: 'group',
      admin: { position: 'sidebar', description: 'SEO — leave blank to fall back to title/summary/heroImage' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'landingPageUrl',
      type: 'text',
      admin: { description: 'Optional — sends the "Our Services" grid tile to a dedicated landing page instead of /services/[slug]' },
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { ...linkField({ name: 'heroCta', label: 'Optional button shown on the hero banner' }) },
    { name: 'body', type: 'richText', editor: lexicalEditor({}) },
    {
      name: 'features',
      type: 'array',
      admin: { description: 'Key benefits/features shown on the service landing page' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'icon', type: 'upload', relationTo: 'media', admin: { description: 'Optional small icon shown above the label' } },
      ],
    },
    {
      name: 'productCategories',
      type: 'array',
      admin: { description: 'Product types this service covers (e.g. T-Shirts, Fleece, Jackets)' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'url', type: 'text', admin: { description: 'Optional — links the tile out to a catalog page in a new tab' } },
      ],
    },
    {
      name: 'processSteps',
      type: 'array',
      admin: { description: '"How it works" steps specific to this service' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'secondaryImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional wide banner image shown below the "How It Works" section' },
    },
    { ...linkField({ name: 'secondaryImageCta', label: 'Optional button shown overlaid on the secondary banner image' }) },
    {
      name: 'secondaryImageBeforeSteps',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show the secondary banner image above "How It Works" instead of below it' },
    },
    {
      name: 'partnerBrands',
      type: 'array',
      admin: { description: 'Brand/product logos associated with this service' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'url', type: 'text', admin: { description: 'Optional — links the logo out to a catalog/product page in a new tab' } },
      ],
    },
    { name: 'catalogHeading', type: 'text', admin: { description: 'Optional image-tile catalog section, e.g. "View Our Full Catalog"' } },
    {
      name: 'catalogItems',
      type: 'array',
      admin: { description: 'Category tiles for the catalog section above' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'url', type: 'text', admin: { description: 'Optional — links the tile out to a catalog page in a new tab' } },
      ],
    },
    {
      name: 'faqEyebrow',
      type: 'text',
      defaultValue: 'Frequently Asked',
      admin: { description: 'FAQ section — leave faqItems empty to hide this section entirely' },
    },
    { name: 'faqHeading', type: 'text', admin: { description: 'Supports line breaks, e.g. "Screen Printing\\nquestions, answered"' } },
    { name: 'faqNote', type: 'text', admin: { description: 'e.g. "Don\'t see your question?"' } },
    { ...linkField({ name: 'faqNoteLink', label: 'FAQ note link, e.g. "Just ask." pointing to /contact' }) },
    {
      name: 'faqItems',
      type: 'array',
      admin: { description: 'Accordion questions and answers' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    { name: 'ctaHeading', type: 'text' },
    { name: 'ctaSubhead', type: 'text' },
    { ...linkField({ name: 'cta', label: 'Bottom CTA Button' }) },
  ],
}
