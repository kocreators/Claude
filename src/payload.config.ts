import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Services } from './collections/Services'
import { Projects } from './collections/Projects'
import { Testimonials } from './collections/Testimonials'
import { Posts } from './collections/Posts'
import { FormSubmissions } from './collections/FormSubmissions'
import { LogoUploads } from './collections/LogoUploads'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Kocreators Admin',
    },
  },
  editor: lexicalEditor({}),
  collections: [Pages, Services, Projects, Posts, Testimonials, Media, FormSubmissions, LogoUploads, Users],
  globals: [Header, Footer, SiteSettings],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
    },
  }),
  // Swap the adapter above for @payloadcms/db-sqlite or @payloadcms/db-mongodb
  // if you'd rather run something other than Postgres.
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  plugins: [
    // Vercel's filesystem doesn't persist between deploys/requests, so media
    // uploads go to Vercel Blob instead of local disk whenever a token is
    // present (i.e. once you've created a Blob store in the Vercel
    // dashboard and set BLOB_READ_WRITE_TOKEN). Locally, without a token,
    // uploads fall back to the Media collection's local `staticDir`.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true, 'logo-uploads': true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
