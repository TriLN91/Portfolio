/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        sunk: token('sunk'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        accent: token('accent'),
        'accent-soft': token('accent-soft'),
        signal: token('signal'),
        ok: token('ok'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Consolas', 'monospace'],
      },
      maxWidth: { wrap: '1200px' },
      transitionTimingFunction: { out: 'cubic-bezier(.2,.7,.2,1)' },
    },
  },
  plugins: [],
}
