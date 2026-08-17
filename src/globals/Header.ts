import type { GlobalConfig } from 'payload'
import { linkField } from '@/fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 8,
      fields: [
        linkField(),
        {
          name: 'subItems',
          type: 'array',
          admin: { description: 'Optional dropdown, e.g. Services > Screen Printing, Headwear...' },
          fields: [linkField({ label: 'Sub-link' })],
        },
      ],
    },
    { name: 'quoteCta', ...linkField({ label: '"Get a Quote" button (top right)' }) },
  ],
}
