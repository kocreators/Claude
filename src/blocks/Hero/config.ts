import type { Block } from 'payload'
import { linkField } from '@/fields/link'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Small label above the headline, e.g. "CUSTOM TEAM APPAREL"' },
    },
    { name: 'headline', type: 'text', required: true, admin: { description: 'Use a line break for a two-line headline, e.g. "Your Brand.\\nMade Better."' } },
    { name: 'subhead', type: 'textarea' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    { name: 'secondaryImage', type: 'upload', relationTo: 'media', admin: { description: 'Optional smaller foreground image for the layered/split hero treatment' } },
    { ...linkField({ name: 'cta',  label: 'Primary button' }) },
    { ...linkField({ name: 'secondaryCta',  label: 'Secondary button (e.g. "See Our Work")', overrideAccess: false }) },
  ],
}
