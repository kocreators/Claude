import type { GlobalConfig } from 'payload'
import { linkField } from '@/fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  fields: [
    { name: 'tagline', type: 'text', defaultValue: 'Ordering custom team apparel & merchandise has never been easier.' },
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'links', type: 'array', fields: [linkField({ label: 'Link' })] },
      ],
    },
    {
      name: 'social',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['Instagram', 'Facebook', 'YouTube', 'X'].map((p) => ({ label: p, value: p.toLowerCase() })),
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'newsletterEnabled', type: 'checkbox', defaultValue: true },
  ],
}
