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
          name: 'megaMenu',
          type: 'checkbox',
          label: 'Show as mega menu',
          defaultValue: false,
          admin: { description: 'Renders sub-items as a wide multi-column panel with descriptions (used for Services).' },
        },
        {
          name: 'subItems',
          type: 'array',
          admin: { description: 'Dropdown items, e.g. Services > Screen Printing, Headwear...' },
          fields: [
            linkField({ label: 'Sub-link' }),
            { name: 'description', type: 'text', admin: { description: 'Only shown in mega menu style, e.g. "High-quality custom printing for teams and events."' } },
          ],
        },
      ],
    },
    { ...linkField({ name: 'quoteCta',  label: '"Start a Project" button (top right)' }) },
  ],
}
