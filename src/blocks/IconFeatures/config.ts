import type { Block } from 'payload'

export const IconFeaturesBlock: Block = {
  slug: 'iconFeatures',
  labels: { singular: 'Icon Features', plural: 'Icon Features Blocks' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
