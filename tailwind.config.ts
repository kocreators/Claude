import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#111111', // primary dark base — hero/footer/dark sections
          soft: '#222222', // charcoal — secondary dark surfaces
        },
        canvas: {
          DEFAULT: '#F4F4F1', // warm off-white — alternating light section base
          light: '#FFFFFF',
        },
        brand: {
          DEFAULT: '#007A63', // Kocreators Green — primary accent, CTAs, links
          dark: '#00614F', // hover state
        },
      },
      fontFamily: {
        display: ['var(--font-anton)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
      borderRadius: {
        tag: '2px',
      },
    },
  },
  plugins: [],
}

export default config
