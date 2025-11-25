/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index-react.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro Text"', 'Inter', 'Helvetica Neue', 'Arial', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Apple Dark Theme
        'apple-dark-bg': '#050509',
        'apple-dark-card': '#111217',
        'apple-dark-card-sec': '#16171D',
        // Apple Light Theme
        'apple-light-bg': '#F5F5F7',
        'apple-light-card': '#FFFFFF',
        // Red Theme System
        'page': '#050307',
        'card': '#10040A',
        'card-elevated': '#180713',
        'primary': '#FDF5F7',
        'secondary': '#C8AFC0',
        'muted': '#8E7587',
        'apple-red': {
          900: '#13030A',
          800: '#250615',
          700: '#3B0820',
          600: '#5A0C2F',
          500: '#FF375F',
          400: '#FF5C7C',
          300: '#FF8FA6',
          200: '#FFC8D6',
        },
        // Accents
        'apple-blue': '#007AFF',
        'apple-blue-dark': '#0A84FF',
        'apple-gray': '#8E8E93',
        'apple-gray-light': '#AEAEB2',
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
    },
  },
  plugins: [],
}
