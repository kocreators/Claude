import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14181F', // primary dark base (not pure black)
          soft: '#1D2330',
        },
        canvas: {
          DEFAULT: '#EEEAE2', // warm grey-canvas base, not the templated cream
          light: '#F7F5F0',
        },
        thread: {
          DEFAULT: '#D9A61C', // gold thread — signature accent
          dark: '#B8880F',
        },
        team: {
          red: '#C23B32', // secondary accent, used sparingly (tags, CTAs)
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
