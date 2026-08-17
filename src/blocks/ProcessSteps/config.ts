import type { Block } from 'payload'
import { linkField } from '@/fields/link'

export const ProcessSteps: Block = {
  slug: 'processSteps',
  labels: { singular: 'Process Steps', plural: 'Process Steps' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'We Keep It Simple' },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'cta', ...linkField({ label: 'Bottom button' }) },
  ],
}
