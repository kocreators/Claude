import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'imageBlock',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'fit',
      type: 'select',
      options: [
        { label: 'Cover (crop to 16:9)', value: 'cover' },
        { label: 'Contain (show full image, e.g. diagrams/maps)', value: 'contain' },
      ],
      defaultValue: 'cover',
    },
    {
      name: 'width',
      type: 'select',
      options: [
        { label: 'Narrow', value: 'narrow' },
        { label: 'Full', value: 'full' },
      ],
      defaultValue: 'narrow',
    },
  ],
}
