import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { SignupThankYouTracking } from './SignupThankYouTracking'

// A confirmation page is a dead end for search traffic and would compete with
// /store-signup itself, so keep it out of the index. It is a static route, so
// it never enters the Payload-driven sitemap either.
export const metadata: Metadata = {
  title: 'Store Signup Received',
  robots: { index: false, follow: false },
}

const PLAN_LABELS: Record<string, string> = {
  basic: 'Free — 10 product limit',
  pro: 'Pro — unlimited categories & SKUs ($249)',
}

const STEPS = [
  {
    title: 'Check your inbox',
    body: 'A confirmation is on its way to the email address you gave us. If it has not arrived in a few minutes, check your spam folder.',
  },
  {
    title: 'We get in touch',
    body: 'A member of the team will reach out within one business day to talk through your store and the next steps.',
  },
  {
    title: 'We build it with you',
    body: 'Products, artwork and pricing get set up together, and you approve everything before your store goes live.',
  },
]

export default async function StoreSignupThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const rawPlan = Array.isArray(params.plan) ? params.plan[0] : params.plan
  const planLabel = rawPlan ? PLAN_LABELS[rawPlan] : undefined

  let phone: string | null = null
  let email: string | null = null
  try {
    const payload = await getCachedPayload()
    const settings = (await payload.findGlobal({ slug: 'site-settings' })) as any
    phone = settings?.phone || null
    email = settings?.email || null
  } catch (err) {
    console.error('Store signup thank-you: could not read site-settings:', err)
  }

  return (
    <>
      <SignupThankYouTracking />

      <section className="bg-canvas py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <span className="mb-6 flex h-14 w-14 items-center justify-center bg-brand text-canvas-light">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>

            <p className="eyebrow mb-5">Store Signup</p>
            <h1 className="text-4xl leading-[0.95] md:text-5xl">Request Received</h1>

            <p className="mt-6 text-lg text-ink/70">
              Thanks — your business store request is in. A member of our team will be in touch within one
              business day to discuss your store and next steps.
            </p>

            {planLabel && (
              <p className="mt-6 inline-block border border-ink/15 bg-canvas-light px-4 py-3 text-sm text-ink/70">
                <span className="label mr-2 text-ink">Plan selected</span>
                {planLabel}
              </p>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-canvas-light py-14 md:py-20">
        <Container>
          <p className="eyebrow mb-10">What Happens Next</p>
          <ol className="grid gap-10 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="mb-4 flex h-9 w-9 items-center justify-center bg-brand font-mono text-sm font-bold text-canvas-light">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="mb-2 text-xl">{step.title}</h2>
                <p className="text-sm text-ink/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-canvas py-14 md:py-20">
        <Container>
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-md">
              <h2 className="mb-3 text-2xl">While You Wait</h2>
              <p className="text-sm text-ink/70">
                Have a look through the full catalog to start shortlisting products for your store.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://kocreators.dcpromosite.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Browse the Catalog
                </a>
                <Link href="/" className="btn-outline">
                  Back to Home
                </Link>
              </div>
            </div>

            {(phone || email) && (
              <div className="border-t border-ink/10 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                <p className="mb-1.5 text-sm font-bold text-ink">Need help sooner?</p>
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
        </Container>
      </section>
    </>
  )
}
