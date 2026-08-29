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
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        heroTight: '-0.04em', // hero/major display headline only
        headlineTight: '-0.03em', // h1/h2/h3/h4 general headline tier
        navLabel: '0.03em', // nav links and buttons
        eyebrowWide: '0.06em', // eyebrow/category + small labels
      },
      borderRadius: {
        tag: '2px',
      },
    },
  },
  plugins: [],
}

export default config
