import Link from 'next/link'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { resolveLink } from '@/lib/resolveLink'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { CTAButton } from '@/components/CTAButton'

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

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item, i) => {
            const { href, label } = resolveLink(item.link)
            const subItems = (item.subItems || []) as any[]
            return (
              <div key={i} className="group relative">
                <Link href={href} className="font-mono text-xs uppercase tracking-widest2 text-ink hover:text-thread-dark">
                  {label}
                </Link>
                {subItems.length > 0 && (
                  <div className="invisible absolute left-0 top-full flex min-w-[200px] flex-col gap-1 border border-ink/10 bg-canvas-light p-3 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                    {subItems.map((sub, j) => {
                      const subLink = resolveLink(sub.link)
                      return (
                        <Link key={j} href={subLink.href} className="px-2 py-1.5 text-sm hover:text-thread-dark">
                          {subLink.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          {siteSettings?.externalShopUrl && (
            <a
              href={siteSettings.externalShopUrl}
              className="hidden font-mono text-xs uppercase tracking-widest2 text-ink hover:text-thread-dark md:inline"
            >
              Shop
            </a>
          )}
          {header?.quoteCta?.link && <CTAButton link={header.quoteCta.link} variant="outline" />}
        </div>
      </Container>
    </header>
  )
}
