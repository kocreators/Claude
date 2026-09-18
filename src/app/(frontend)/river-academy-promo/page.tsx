import type { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/Container'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { PromoCodeForm } from './PromoCodeForm'

// An unlisted campaign page: it is not in the header nav, and because it is a
// static route rather than a Payload page it never enters the sitemap (which
// enumerates the pages/services/projects/posts collections). noindex keeps it
// out of search results even if the link gets shared around.
export const metadata: Metadata = {
  title: 'River Academy — Promo Code',
  robots: { index: false, follow: false },
}

const STEPS = [
  {
    title: 'Register on the store',
    body: 'Create your account on the Kocreators store first. Promo codes are tied to a specific account, so there needs to be one to attach it to.',
  },
  {
    title: 'Request your code',
    body: 'Fill in the form with the same email address you registered with, so we can match the code to your account.',
  },
  {
    title: 'We email it to you',
    body: 'We generate a code just for your account and send it over. Use it at checkout on any order of $100 or more.',
  },
]

export default async function RiverAcademyPromoPage() {
  let phone: string | null = null
  let email: string | null = null
  let shopUrl: string | null = null
  try {
    const payload = await getCachedPayload()
    const settings = (await payload.findGlobal({ slug: 'site-settings' })) as any
    phone = settings?.phone || null
    email = settings?.email || null
    shopUrl = settings?.externalShopUrl || null
  } catch (err) {
    console.error('River Academy promo page: could not read site-settings:', err)
  }

  return (
    <>
      <section className="bg-canvas py-14 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <Image
              src="/images/river-academy.webp"
              alt="The River Academy"
              width={1080}
              height={336}
              priority
              className="mb-10 h-auto w-[220px] md:w-[280px]"
            />

            <p className="eyebrow mb-5">Exclusive Offer</p>
            <h1 className="text-4xl leading-[0.95] md:text-[clamp(2.5rem,5.9vw,3.25rem)]">
              <span className="block">Spend $100,</span>
              <span className="block">Get $20 Off.</span>
            </h1>

            <p className="mt-6 text-lg text-ink/70">
              A thank-you for River Academy families. Request a promo code below and we&rsquo;ll send
              one over for your next order.
            </p>

            <p className="mt-6 border-l-2 border-brand bg-canvas-light px-5 py-4 text-sm text-ink/75">
              <span className="label mb-1 block text-ink">Register first</span>
              Promo codes are created for a specific account, so please register on the store before
              requesting yours. Use the same email address in both places and we&rsquo;ll match them up.
              {shopUrl && (
                <>
                  {' '}
                  <a
                    href={shopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand underline underline-offset-2"
                  >
                    Register on the store
                  </a>
                  .
                </>
              )}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-canvas-light py-14 md:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div className="order-2 border border-ink/10 bg-canvas-light p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] md:p-10 lg:order-1">
              <h2 className="mb-8 text-2xl md:text-3xl">Request Your Promo Code</h2>
              <PromoCodeForm phone={phone} email={email} />
            </div>

            <div className="order-1 lg:order-2">
              <p className="eyebrow mb-8">How It Works</p>
              <ol className="grid gap-8">
                {STEPS.map((step, i) => (
                  <li key={step.title}>
                    <span className="mb-3 flex h-9 w-9 items-center justify-center bg-brand font-mono text-sm font-bold text-canvas-light">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mb-2 text-lg">{step.title}</h3>
                    <p className="text-sm text-ink/70">{step.body}</p>
                  </li>
                ))}
              </ol>

              {(phone || email) && (
                <div className="mt-10 border-t border-ink/10 pt-6">
                  <p className="mb-1.5 text-sm font-bold text-ink">Need a hand?</p>
                  <p className="text-sm text-ink/70">
                    {phone && (
                      <>
                        Call{' '}
                        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="font-medium text-brand">
                          {phone}
                        </a>
                      </>
                    )}
                    {phone && email && ' or email '}
                    {email && (
                      <a href={`mailto:${email}`} className="font-medium text-brand">
                        {email}
                      </a>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
