import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials Blocks' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Testimonials' },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
    },
  ],
}
