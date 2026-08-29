const ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 8.5h2.5V5H15c-2.21 0-4 1.79-4 4v2H8.5v3.5H11V21h3.5v-6.5H17l.5-3.5h-3V9c0-.28.22-.5.5-.5Z"
        fill="currentColor"
      />
    </svg>
  ),
}

export function SocialIcon({ platform }: { platform: string }) {
  const icon = ICONS[platform.trim().toLowerCase()]
  if (!icon) return <span className="text-sm font-medium">{platform}</span>
  return <span className="block h-5 w-5">{icon}</span>
}
