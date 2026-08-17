import type { Block } from 'payload'

export const TrustedBrands: Block = {
  slug: 'trustedBrands',
  labels: { singular: 'Trusted Brands', plural: 'Trusted Brands Blocks' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Brands We Print For' },
    {
      name: 'logos',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}
