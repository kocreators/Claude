import type { Field } from 'payload'

// Reusable "link" field group used across blocks (buttons, nav items, CTAs).
// Lets editors link internally to a Page/Service/Post, or paste an external URL.
export const linkField = (overrides: { overrideAccess?: boolean; label?: string } = {}): Field => ({
  name: 'link',
  type: 'group',
  label: overrides.label || 'Link',
  fields: [
    {
      name: 'type',
      type: 'radio',
      options: [
        { label: 'Internal page', value: 'internal' },
        { label: 'Custom URL', value: 'custom' },
      ],
      defaultValue: 'internal',
      admin: { layout: 'horizontal' },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'internal',
      type: 'relationship',
      relationTo: ['pages', 'services', 'posts'],
      admin: { condition: (_, siblingData) => siblingData?.type === 'internal' },
    },
    {
      name: 'url',
      type: 'text',
      admin: { condition: (_, siblingData) => siblingData?.type === 'custom' },
    },
    {
      name: 'newTab',
      type: 'checkbox',
      label: 'Open in new tab',
      defaultValue: false,
    },
  ],
})
