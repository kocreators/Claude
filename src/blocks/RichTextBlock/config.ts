import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text Blocks' },
  fields: [
    { name: 'eyebrow', type: 'text', admin: { description: 'Optional small green label shown above the content, e.g. "Our Clients"' } },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
      required: true,
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
