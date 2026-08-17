import type { CollectionConfig } from 'payload'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'formType', 'createdAt'] },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        { label: 'Quote Request', value: 'quote' },
        { label: 'Contact', value: 'contact' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'organization', type: 'text', admin: { description: 'Team, school, or business name' } },
    { name: 'message', type: 'textarea' },
    { name: 'shopUrl', type: 'text', admin: { description: 'Where to send them, e.g. existing WooCommerce shop link' } },
  ],
}
