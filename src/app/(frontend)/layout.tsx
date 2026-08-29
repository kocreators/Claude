import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HubspotChat } from '@/components/HubspotChat'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})

const siteName = 'Kocreators'
const defaultTitle = 'Kocreators — Custom Team Apparel & Merchandise'
const defaultDescription =
  'Ordering custom team apparel and merchandise has never been easier. Screen printing, embroidery, and full-service brand merch for teams, schools, and businesses.'

export const metadata: Metadata = {
  metadataBase: new URL('https://kocreators.com'),
  title: { default: defaultTitle, template: `%s — ${siteName}` },
  description: defaultDescription,
  openGraph: {
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
  },
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <HubspotChat />
      </body>
    </html>
  )
}
