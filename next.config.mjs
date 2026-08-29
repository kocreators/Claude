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
    ],
  },

  async rewrites() {
    return [
      {
        source: '/arworkshop',
        destination: 'https://zjbdxni3a9.onrocket.site/arworkshop',
      },
      {
        source: '/arworkshop/:path*',
        destination: 'https://zjbdxni3a9.onrocket.site/arworkshop/:path*',
      },

      {
        source: '/streamlinebrands',
        destination: 'https://zjbdxni3a9.onrocket.site/streamlinebrands',
      },
      {
        source: '/streamlinebrands/:path*',
        destination: 'https://zjbdxni3a9.onrocket.site/streamlinebrands/:path*',
      },

      {
        source: '/stretchngrow',
        destination: 'https://zjbdxni3a9.onrocket.site/stretchngrow',
      },
      {
        source: '/stretchngrow/:path*',
        destination: 'https://zjbdxni3a9.onrocket.site/stretchngrow/:path*',
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
