import type { Block } from 'payload'
import { linkField } from '@/fields/link'

export const PromoSpotlight: Block = {
  slug: 'promoSpotlight',
  labels: { singular: 'Promotional Products Spotlight', plural: 'Promotional Products Spotlights' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'If You Can Put a Logo on It,\nWe Can Probably Make It.' },
    { name: 'body', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      fields: [
        { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "Drinkware"' } },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    { ...linkField({ name: 'cta',  label: '"Find a Product" button' }) },
  ],
}
