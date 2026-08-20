import Link from 'next/link'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { resolveLink } from '@/lib/resolveLink'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { CTAButton } from '@/components/CTAButton'
import { MobileNav } from '@/components/MobileNav'

export async function Header() {
  const payload = await getCachedPayload()
  const [header, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: 'header' }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  const navItems = (header?.navItems || []) as any[]

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-canvas-light/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-9 lg:flex">
          {navItems.map((item, i) => {
            const { href, label } = resolveLink(item.link)
            const subItems = (item.subItems || []) as any[]
            const isMega = item.megaMenu && subItems.length > 0

            return (
              <div key={i} className="group relative">
                <Link
                  href={href}
                  className="font-mono text-xs uppercase tracking-widest2 text-ink transition-colors hover:text-brand"
                >
                  {label}
                </Link>

                {subItems.length > 0 && !isMega && (
                  <div className="invisible absolute left-0 top-full flex min-w-[220px] flex-col gap-1 border-t-2 border-brand bg-canvas-light p-3 opacity-0 shadow-[0_16px_32px_rgba(17,17,17,0.08)] transition-all duration-150 group-hover:visible group-hover:opacity-100">
                    {subItems.map((sub, j) => {
                      const subLink = resolveLink(sub.link)
                      return (
                        <Link key={j} href={subLink.href} className="px-3 py-2 text-sm text-ink hover:text-brand">
                          {subLink.label}
                        </Link>
                      )
                    })}
                  </div>
                )}

                {isMega && (
                  <div className="invisible fixed left-0 right-0 top-20 z-40 border-t-2 border-brand bg-canvas-light opacity-0 shadow-[0_24px_48px_rgba(17,17,17,0.10)] transition-all duration-150 group-hover:visible group-hover:opacity-100">
                    <Container className="grid grid-cols-3 gap-x-10 gap-y-8 py-12">
                      {subItems.map((sub, j) => {
                        const subLink = resolveLink(sub.link)
                        return (
                          <Link key={j} href={subLink.href} className="group/item block border-b border-ink/10 pb-6">
                            <span className="font-display text-lg tracking-tight text-ink group-hover/item:text-brand">
                              {subLink.label}
                            </span>
                            {sub.description && (
                              <span className="mt-1 block text-sm text-ink/60">{sub.description}</span>
                            )}
                          </Link>
                        )
                      })}
                    </Container>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="flex items-center gap-5">
          {siteSettings?.externalShopUrl && (
            <a
              href={siteSettings.externalShopUrl}
              className="hidden font-mono text-xs uppercase tracking-widest2 text-ink hover:text-brand md:inline"
            >
              Shop
            </a>
          )}
          {header?.quoteCta && (
            <span className="hidden md:inline-block">
              <CTAButton link={header.quoteCta} variant="primary" />
            </span>
          )}
          <MobileNav navItems={navItems} quoteCta={header?.quoteCta} shopUrl={siteSettings?.externalShopUrl} />
        </div>
      </Container>
    </header>
  )
}
