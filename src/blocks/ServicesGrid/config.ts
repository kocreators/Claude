import type { Block } from 'payload'

export const ServicesGrid: Block = {
  slug: 'servicesGrid',
  labels: { singular: 'Services Grid', plural: 'Services Grids' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Our Services' },
    {
      name: 'source',
      type: 'radio',
      options: [
        { label: 'Pull from Services collection', value: 'collection' },
        { label: 'Manual selection', value: 'manual' },
      ],
      defaultValue: 'collection',
      admin: { layout: 'horizontal' },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { condition: (_, sibling) => sibling?.source === 'manual' },
    },
  ],
}
