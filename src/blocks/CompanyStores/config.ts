import type { Block } from 'payload'
import { linkField } from '@/fields/link'

export const CompanyStores: Block = {
  slug: 'companyStores',
  labels: { singular: 'Company Stores Feature', plural: 'Company Stores Features' },
  fields: [
    { name: 'kicker', type: 'text', defaultValue: 'Brand Stores' },
    { name: 'heading', type: 'text', defaultValue: 'Your Brand Store.\nWithout the Headaches.' },
    { name: 'body', type: 'textarea' },
    {
      name: 'capabilities',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    { name: 'storeMockupImage', type: 'upload', relationTo: 'media', admin: { description: 'Screenshot of an example branded store, shown in a browser/device frame' } },
    { ...linkField({ name: 'cta', label: '"Explore Brand Stores" button' }) },
  ],
}
