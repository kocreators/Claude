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
    { name: 'storeMockupImage', type: 'upload', relationTo: 'media', admin: { description: 'Desktop screenshot of an example branded store, shown in a computer monitor frame' } },
    { name: 'storeMockupMobileImage', type: 'upload', relationTo: 'media', admin: { description: 'Mobile screenshot of the same store, shown in a phone frame overlapping the monitor' } },
    { ...linkField({ name: 'cta', label: '"Explore Brand Stores" button' }) },
    { ...linkField({ name: 'previewCta', label: 'Button shown below the store mockup screenshots (e.g. "Preview a Live Brand Store")' }) },
  ],
}
