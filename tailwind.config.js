/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-color)',
        sidebar: 'var(--sidebar-color)',
        panel: 'var(--panel-bg)',
        primary: {
          DEFAULT: 'var(--text-primary)',
          foreground: 'var(--bg-color)',
        },
        secondary: {
          DEFAULT: 'var(--text-secondary)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
        },
        theme: {
          bg: 'var(--bg-color)',
          sidebar: 'var(--sidebar-color)',
          panel: 'var(--panel-bg)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          accent: 'var(--accent)',
          border: 'var(--border-color)',
          'border-muted': 'var(--border-muted)',
          'border-hover': 'var(--border-hover)',
          surface: 'var(--card-surface)',
          btn: 'var(--btn-primary-bg)',
          'btn-text': 'var(--btn-primary-text)',
          'btn-hover': 'var(--btn-primary-hover)',
        },
        glass: {
          panel: 'var(--glass-panel)',
          input: 'var(--glass-input)',
          border: 'var(--border-color)',
          'border-muted': 'var(--border-muted)',
          'border-hover': 'var(--border-hover)',
        },
        status: {
          supported: 'var(--status-supported)',
          'supported-bg': 'var(--status-supported-bg)',
          'supported-border': 'var(--status-supported)',
          contradicted: 'var(--status-contradicted)',
          'contradicted-bg': 'var(--status-contradicted-bg)',
          'contradicted-border': 'var(--status-contradicted)',
          unsupported: 'var(--status-unsupported)',
          'unsupported-bg': 'var(--status-unsupported-bg)',
          'unsupported-border': 'var(--status-unsupported)',
        }
      },
      fontFamily: {
        michroma: ['Michroma', 'sans-serif'],
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderColor: {
        token: 'var(--border-color)',
      }
    },
  },
  plugins: [],
}
