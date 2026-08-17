import Link from 'next/link'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-2xl tracking-tight">
      <span className={light ? 'text-canvas' : 'text-ink'}>KO</span>
      <span className="text-thread">CREATORS</span>
    </Link>
  )
}
