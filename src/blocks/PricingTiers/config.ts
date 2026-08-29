import type { Block } from 'payload'
import { linkField } from '@/fields/link'

export const PricingTiersBlock: Block = {
  slug: 'pricingTiers',
  labels: { singular: 'Pricing Tiers', plural: 'Pricing Tiers Blocks' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'tiers',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'priceLabel', type: 'text', required: true, admin: { description: 'e.g. "Free" or "$249"' } },
        { ...linkField({ name: 'cta', label: 'Button' }) },
      ],
    },
  ],
}
