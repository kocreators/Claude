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
        { label: 'Store Signup', value: 'storeSignup' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'organization', type: 'text', admin: { description: 'Team, school, or business name' } },
    { name: 'businessName', type: 'text', admin: { description: 'Store signups: business name' } },
    {
      name: 'storePlatform',
      type: 'select',
      options: [
        { label: 'Free — 10 Product Limit', value: 'basic' },
        { label: 'Pro — Unlimited Categories & SKUs ($249)', value: 'pro' },
      ],
    },
    { name: 'productInterest', type: 'text', admin: { description: 'Quote requests: product(s) interested in' } },
    { name: 'productColor', type: 'text' },
    { name: 'quantity', type: 'text', admin: { description: 'Estimated quantity' } },
    { name: 'inHandsDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    {
      name: 'logos',
      type: 'array',
      admin: { description: 'Logo files uploaded with a quote request' },
      fields: [{ name: 'file', type: 'upload', relationTo: 'logo-uploads', required: true }],
    },
    { name: 'message', type: 'textarea', admin: { description: 'Project details / anything else' } },
    { name: 'shopUrl', type: 'text', admin: { description: 'Where to send them, e.g. existing WooCommerce shop link' } },
  ],
}
