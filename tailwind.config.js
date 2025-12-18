/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Backgrounds
        page: 'var(--bg-app-page)',
        card: 'var(--bg-app-card)',
        'card-hover': 'var(--bg-app-card-hover)',
        elevated: 'var(--bg-elevated)',
        
        // Text
        foreground: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        inverted: 'var(--text-inverted)',

        // Borders
        border: 'var(--border-subtle)',
        'border-strong': 'var(--border-strong)',

        // Accents
        primary: 'var(--primary)',
        'primary-strong': 'var(--primary-strong)',
        
        // Status
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
      },
      borderRadius: {
        'card': 'var(--radius-card)',
        'pill': 'var(--radius-pill)',
      },
      letterSpacing: {
        tight: '-0.02em',
        tighter: '-0.04em',
      },
      boxShadow: {
        'glow': '0 0 20px var(--primary-glow)',
      }
    },
  },
  plugins: [],
}
