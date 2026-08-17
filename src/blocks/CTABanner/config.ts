import type { Block } from 'payload'
import { linkField } from '@/fields/link'

export const CTABanner: Block = {
  slug: 'ctaBanner',
  labels: { singular: 'CTA Banner', plural: 'CTA Banners' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'subhead', type: 'text' },
    { name: 'cta', ...linkField({ label: 'Button' }) },
    {
      name: 'style',
      type: 'select',
      options: [
        { label: 'Ink (dark)', value: 'dark' },
        { label: 'Canvas (light)', value: 'light' },
        { label: 'Thread (accent)', value: 'accent' },
      ],
      defaultValue: 'dark',
    },
  ],
}
