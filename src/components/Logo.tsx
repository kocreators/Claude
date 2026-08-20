import Link from 'next/link'
import Image from 'next/image'

// Renders the actual Kocreators mark supplied by the client — never redraw,
// recolor, or reconstruct this as text. The source file is the full green
// elephant + black wordmark lockup at public/logo.webp (1600x752).
//
// On dark sections (footer, hero overlays) the mark sits on a small white
// plate rather than being recolored, since the wordmark is black and would
// disappear against a dark background otherwise.
export function Logo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Kocreators — home">
      {light ? (
        <span className="inline-flex items-center bg-canvas-light px-3 py-2">
          <Image src="/logo.webp" alt="Kocreators" width={170} height={80} priority className="h-9 w-auto md:h-10" />
        </span>
      ) : (
        <Image src="/logo.webp" alt="Kocreators" width={170} height={80} priority className="h-10 w-auto md:h-12" />
      )}
    </Link>
  )
}
