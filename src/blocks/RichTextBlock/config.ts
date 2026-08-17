import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text Blocks' },
  fields: [
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
