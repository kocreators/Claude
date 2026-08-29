import Link from 'next/link'
import Image from 'next/image'

// Renders the actual Kocreators mark supplied by the client — never redraw,
// recolor, or reconstruct this as text. The default is the full green
// elephant + black wordmark lockup at public/logo.webp (1600x752).
//
// On dark sections (footer) we use the client's dark-background mark at
// public/logo-mark.png — green elephant + white "KOCREATORS" text, both
// meant to be seen against a dark background (the white text is invisible
// on a white canvas, which is expected, not a defect).
export function Logo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Kocreators — home">
      {light ? (
        <Image src="/logo-mark.png" alt="Kocreators" width={1600} height={752} priority className="h-10 w-auto md:h-12" />
      ) : (
        <Image src="/logo.webp" alt="Kocreators" width={170} height={80} priority className="h-10 w-auto md:h-12" />
      )}
    </Link>
  )
}
