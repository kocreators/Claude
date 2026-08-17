import type { Block } from 'payload'
import { linkField } from '@/fields/link'

export const StoryStatement: Block = {
  slug: 'storyStatement',
  labels: { singular: 'Story Statement', plural: 'Story Statements' },
  fields: [
    { name: 'kicker', type: 'text', admin: { description: 'e.g. "The Story"' } },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'video', type: 'upload', relationTo: 'media', admin: { description: 'Optional looping background video' } },
    { name: 'cta', ...linkField({ label: 'Button' }) },
  ],
}
