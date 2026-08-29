import type { CollectionConfig } from 'payload'

// Customer-submitted logo files from the "Start a Project" quote form.
// Kept separate from Media (which is image/mp4-only, for published site
// content) since print-ready logo files are often PDF/AI/EPS.
export const LogoUploads: CollectionConfig = {
  slug: 'logo-uploads',
  admin: { useAsTitle: 'filename' },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    staticDir: '../logo-uploads',
    mimeTypes: ['image/*', 'application/pdf', 'application/postscript', 'application/illustrator'],
  },
  fields: [],
}
