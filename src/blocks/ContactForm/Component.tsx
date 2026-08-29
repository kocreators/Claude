import { Suspense } from 'react'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { Container } from '@/components/Container'
import { SocialIcon } from '@/components/SocialIcon'
import { QuoteForm } from './QuoteForm'
import { StoreSignupForm } from './StoreSignupForm'
import { SimpleContactForm } from './SimpleContactForm'

export async function ContactFormBlockComponent({ block }: { block: any }) {
  const formType = block.formType || 'quote'

  if (formType === 'quote' || formType === 'storeSignup') {
    const payload = await getCachedPayload()
    const [siteSettings, footer] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings' }),
      payload.findGlobal({ slug: 'footer' }),
    ])
    const social = (footer?.social || []) as any[]

    return (
      <section className="bg-canvas-light py-20 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <div className="border border-ink/10 bg-canvas-light p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] md:p-10">
              {formType === 'storeSignup' && block.heading && (
                <h2 className="mb-8 text-2xl md:text-3xl">{block.heading}</h2>
              )}
              {formType === 'quote' ? (
                <QuoteForm phone={siteSettings?.phone} email={siteSettings?.email} />
              ) : (
                <Suspense fallback={null}>
                  <StoreSignupForm phone={siteSettings?.phone} email={siteSettings?.email} />
                </Suspense>
              )}
            </div>

            <div>
              {block.subhead && <p className="mb-8 text-ink/70">{block.subhead}</p>}

              <div className="space-y-6 border-t border-ink/10 pt-8">
                {siteSettings?.phone && (
                  <div>
                    <p className="label mb-1.5 text-ink/40">Call Us</p>
                    <a href={`tel:${siteSettings.phone.replace(/[^\d+]/g, '')}`} className="text-lg font-bold text-brand">
                      {siteSettings.phone}
                    </a>
                    {siteSettings.hours && <p className="mt-1 text-sm text-ink/60">{siteSettings.hours}</p>}
                  </div>
                )}
                {siteSettings?.email && (
                  <div>
                    <p className="label mb-1.5 text-ink/40">Email Us</p>
                    <a href={`mailto:${siteSettings.email}`} className="text-sm font-medium text-ink hover:text-brand">
                      {siteSettings.email}
                    </a>
                  </div>
                )}
                {formType === 'storeSignup' && social.length > 0 && (
                  <div>
                    <p className="label mb-1.5 text-ink/40">Follow Us</p>
                    <div className="flex gap-4">
                      {social.map((s: any, i: number) => (
                        <a
                          key={i}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.platform}
                          className="text-ink hover:text-brand"
                        >
                          <SocialIcon platform={s.platform} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  const siteSettings = await getCachedPayload().then((payload) => payload.findGlobal({ slug: 'site-settings' }))

  return (
    <section className="bg-canvas-light py-24">
      <Container className="max-w-2xl">
        <h2 className="mb-4 text-3xl md:text-4xl">{block.heading}</h2>
        {block.subhead && <p className="mb-10 text-ink/70">{block.subhead}</p>}
        <SimpleContactForm phone={siteSettings?.phone} email={siteSettings?.email} />
      </Container>
    </section>
  )
}
