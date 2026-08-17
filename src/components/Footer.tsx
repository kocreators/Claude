import Link from 'next/link'
import { getCachedPayload } from '@/lib/getCachedPayload'
import { resolveLink } from '@/lib/resolveLink'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'

export async function Footer() {
  const payload = await getCachedPayload()
  const [footer, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: 'footer' }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  const columns = (footer?.columns || []) as any[]
  const social = (footer?.social || []) as any[]

  return (
    <footer className="bg-ink text-canvas">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm text-canvas/70">{footer?.tagline}</p>
          {siteSettings?.phone && <p className="font-mono text-sm">{siteSettings.phone}</p>}
          {siteSettings?.hours && <p className="text-xs text-canvas/60">{siteSettings.hours}</p>}
        </div>

        {columns.map((col, i) => (
          <div key={i}>
            <h4 className="eyebrow mb-4 text-canvas/60">{col.heading}</h4>
            <ul className="space-y-2">
              {(col.links || []).map((item: any, j: number) => {
                const { href, label } = resolveLink(item.link)
                return (
                  <li key={j}>
                    <Link href={href} className="text-sm text-canvas/80 hover:text-thread">
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </Container>

      <Container className="flex flex-col items-center justify-between gap-4 border-t border-canvas/10 py-6 md:flex-row">
        <p className="text-xs text-canvas/50">
          © {new Date().getFullYear()} {siteSettings?.siteName || 'Kocreators'}. All rights reserved.
        </p>
        <div className="flex gap-4">
          {social.map((s: any, i: number) => (
            <a key={i} href={s.url} className="text-xs uppercase tracking-widest2 text-canvas/60 hover:text-thread">
              {s.platform}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  )
}
