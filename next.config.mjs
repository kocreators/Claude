import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Allows the "Start a Project" quote form to accept logo file uploads.
      bodySizeLimit: '20mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      // Vercel Blob's public storage domain (see src/payload.config.ts)
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      // Add your production custom domain here too, if media is ever
      // served from it directly, e.g.:
      // { protocol: 'https', hostname: 'kocreators.com' },
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
