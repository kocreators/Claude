import Link from 'next/link'
import { resolveLink } from '@/lib/resolveLink'

type Variant = 'primary' | 'outline' | 'outline-light'

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  'outline-light': 'btn-outline-light',
}

export function CTAButton({ link, variant = 'primary' }: { link: any; variant?: Variant }) {
  if (!link) return null
  const { href, label, target } = resolveLink(link)
  if (!label) return null

  return (
    <Link href={href} target={target} className={variantClass[variant]}>
      {label}
    </Link>
  )
}
