import type { GlobalConfig } from 'payload'

// Central place for contact details & the existing shop link, since checkout
// stays on the current WooCommerce store rather than moving into Payload.
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'Kocreators' },
    { name: 'phone', type: 'text', defaultValue: '(888) 488-5388' },
    { name: 'hours', type: 'text', defaultValue: 'Monday – Friday, 8am – 6pm PST' },
    { name: 'email', type: 'email' },
    { name: 'address', type: 'text' },
    {
      name: 'externalShopUrl',
      type: 'text',
      required: true,
      admin: { description: 'Existing WooCommerce shop the "Shop" / "Login" links point to' },
    },
    { name: 'quoteRequestUrl', type: 'text', admin: { description: 'Existing quote request form, if kept external' } },
  ],
}
