import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  labels: { singular: 'Contact / Quote Form', plural: 'Contact / Quote Forms' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Request a Quote' },
    { name: 'subhead', type: 'textarea' },
    {
      name: 'formType',
      type: 'select',
      defaultValue: 'quote',
      options: [
        { label: 'Quote Request', value: 'quote' },
        { label: 'General Contact', value: 'contact' },
        { label: 'Store Signup', value: 'storeSignup' },
      ],
    },
  ],
}
