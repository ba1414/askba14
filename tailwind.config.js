/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Apple's "System UI" stack serves SF Pro automatically on Mac/iOS
        sans: ["var(--font-system)", "sans-serif"],
      },
      letterSpacing: {
        // Tighter tracking for large headlines (Apple style)
        tighter: "-0.04em",
        tight: "-0.02em",
        normal: "0em",
        wide: "0.02em",
      },
      colors: {
        // Semantic color system for "Light Mode" default (Dark mode handled via CSS variables if needed later)
        "apple-gray": {
          50: "#F5F5F7",  // Common Apple background gray
          100: "#E8E8ED",
          200: "#D2D2D7",
          300: "#86868B", // Subtext
          400: "#6E6E73",
          500: "#424245",
          600: "#1D1D1F", // "Almost Black" (Use this for headings)
          700: "#121212",
          800: "#000000",
        },
        "glass": {
          DEFAULT: "rgba(255, 255, 255, 0.75)", // The frosted material base
          border: "rgba(255, 255, 255, 0.4)",   // Subtle highlight border
          stroke: "rgba(0, 0, 0, 0.08)",        // Darker border for contrast
        },
        "accent": {
          DEFAULT: "#0071E3", // classic Apple Blue
          hover: "#0077ED",
        }
      },
      backgroundImage: {
        // Subtle gradients for "Depth" without clutter
        "mesh-fade": "radial-gradient(circle at 50% 0%, rgba(120, 119, 198, 0.1) 0%, transparent 60%)",
      },
      boxShadow: {
        // "Spatial" shadows - soft, diffused, top-down light
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'glass-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0,0,0,0.02)',
        'glass-md': '0 8px 30px -6px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.02)',
        'glass-lg': '0 20px 40px -8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.02)',
        'glow': '0 0 20px rgba(0, 113, 227, 0.15)',
      },
      blur: {
        xs: '2px',
        '3xl': '64px', // For background abstract blobs
      },
      transitionTimingFunction: {
        // The "iOS Physics" curve (smooth start, snappy end)
        'apple-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
      }
    },
  },
  plugins: [],
}
