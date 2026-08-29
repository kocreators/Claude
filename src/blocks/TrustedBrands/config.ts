import type { Block } from 'payload'

export const TrustedBrands: Block = {
  slug: 'trustedBrands',
  labels: { singular: 'Trusted Brands', plural: 'Trusted Brands Blocks' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Brands We Print For' },
    {
      name: 'logoScale',
      type: 'number',
      defaultValue: 1,
      admin: { description: 'Size multiplier for the logos in this section (1 = default size)' },
    },
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
