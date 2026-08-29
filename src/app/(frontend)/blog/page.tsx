import Script from 'next/script'
import type { Metadata } from 'next'
import { Container } from '@/components/Container'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tips and guides on custom apparel, promotional products, and branded merchandise programs from the Kocreators team.',
}

export default function BlogIndexPage() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="mb-12 text-4xl md:text-5xl">Our Blog</h1>
        <div id="soro-blog"></div>
        <Script src="https://app.trysoro.com/api/embed/0751ac0c-c28a-4a03-a88e-e9faa7356a2b" strategy="afterInteractive" />
      </Container>
    </section>
  )
}
