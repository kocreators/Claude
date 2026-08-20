import type { Block } from 'payload'
import { linkField } from '@/fields/link'

export const PortfolioGrid: Block = {
  slug: 'portfolioGrid',
  labels: { singular: 'Portfolio Grid (Our Work)', plural: 'Portfolio Grids' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'We Make Good Brands Look Even Better.' },
    {
      name: 'source',
      type: 'radio',
      options: [
        { label: 'Featured projects', value: 'featured' },
        { label: 'Manual selection', value: 'manual' },
      ],
      defaultValue: 'featured',
      admin: { layout: 'horizontal' },
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: { condition: (_, sibling) => sibling?.source === 'manual' },
    },
    { name: 'limit', type: 'number', defaultValue: 6, admin: { condition: (_, sibling) => sibling?.source === 'featured' } },
    { ...linkField({ name: 'cta',  label: '"View All Work" button' }) },
  ],
}
