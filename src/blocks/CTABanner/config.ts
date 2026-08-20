import type { Block } from 'payload'
import { linkField } from '@/fields/link'

export const CTABanner: Block = {
  slug: 'ctaBanner',
  labels: { singular: 'CTA Banner', plural: 'CTA Banners' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'subhead', type: 'text' },
    { ...linkField({ name: 'cta',  label: 'Button' }) },
    {
      name: 'style',
      type: 'select',
      options: [
        { label: 'Ink (dark)', value: 'dark' },
        { label: 'Canvas (light)', value: 'light' },
        { label: 'Kocreators Green (accent)', value: 'accent' },
      ],
      defaultValue: 'dark',
    },
  ],
}
