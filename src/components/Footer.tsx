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
    <footer className="bg-ink text-canvas-light">
      <Container className="grid gap-12 py-20 md:grid-cols-[1.3fr_repeat(3,1fr)] md:py-24">
        <div className="space-y-5">
          <Logo light />
          <p className="max-w-xs text-sm text-canvas-light/65">{footer?.tagline}</p>
          {siteSettings?.email && (
            <a href={`mailto:${siteSettings.email}`} className="block font-mono text-sm text-canvas-light hover:text-brand">
              {siteSettings.email}
            </a>
          )}
          {siteSettings?.phone && <p className="font-mono text-sm text-canvas-light/90">{siteSettings.phone}</p>}
          {siteSettings?.hours && <p className="text-xs text-canvas-light/50">{siteSettings.hours}</p>}
        </div>

        {columns.map((col, i) => (
          <div key={i}>
            <h4 className="eyebrow mb-5 text-canvas-light/50">{col.heading}</h4>
            <ul className="space-y-3">
              {(col.links || []).map((item: any, j: number) => {
                const { href, label } = resolveLink(item.link)
                return (
                  <li key={j}>
                    <Link href={href} className="text-sm text-canvas-light/80 hover:text-brand">
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </Container>

      <Container className="flex flex-col items-center justify-between gap-4 border-t border-canvas-light/10 py-6 md:flex-row">
        <p className="text-xs text-canvas-light/40">
          © {new Date().getFullYear()} {siteSettings?.siteName || 'Kocreators'}. All rights reserved.
        </p>
        <div className="flex gap-5">
          {social.map((s: any, i: number) => (
            <a key={i} href={s.url} className="text-xs uppercase tracking-widest2 text-canvas-light/50 hover:text-brand">
              {s.platform}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  )
}
