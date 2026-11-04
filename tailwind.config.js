/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#080808',
        sidebar: '#0A0A0A',
        primary: {
          DEFAULT: '#ECE4B4',
          foreground: '#080808',
        },
        secondary: {
          DEFAULT: '#B9B49B',
        },
        accent: {
          DEFAULT: '#4F4D3C',
        },
        glass: {
          panel: 'rgba(255, 255, 255, 0.035)',
          input: 'rgba(255, 255, 255, 0.025)',
          border: 'rgba(236, 228, 180, 0.22)',
          'border-muted': 'rgba(236, 228, 180, 0.10)',
          'border-hover': 'rgba(236, 228, 180, 0.40)',
        },
        status: {
          supported: '#4ADE80',
          'supported-bg': 'rgba(74, 222, 128, 0.1)',
          'supported-border': 'rgba(74, 222, 128, 0.3)',
          contradicted: '#F87171',
          'contradicted-bg': 'rgba(248, 113, 113, 0.1)',
          'contradicted-border': 'rgba(248, 113, 113, 0.3)',
          unsupported: '#FBBF24',
          'unsupported-bg': 'rgba(251, 191, 36, 0.1)',
          'unsupported-border': 'rgba(251, 191, 36, 0.3)',
        }
      },
      fontFamily: {
        michroma: ['Michroma', 'sans-serif'],
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderColor: {
        token: 'rgba(236, 228, 180, 0.22)',
      }
    },
  },
  plugins: [],
}
