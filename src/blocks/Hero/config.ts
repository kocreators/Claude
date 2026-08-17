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
    { name: 'headline', type: 'text', required: true },
    { name: 'subhead', type: 'textarea' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    { name: 'cta', ...linkField({ label: 'Primary button' }) },
  ],
}
