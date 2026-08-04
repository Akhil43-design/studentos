/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Minimal Apple + Notion + Linear Warm Neutral Palette
        'warm-white': '#F7F6F3',
        'off-white': '#F2F1EE',
        'soft-ivory': '#ECEAE6',
        'sidebar-gray': '#E7E5E1',
        'border-gray': '#D7D4CF',
        charcoal: '#2E2E2E',
        'text-secondary': '#767676',
        'text-disabled': '#B7B7B7',
        
        // Muted Pastel Accents
        'slate-blue': '#6B8FD8',
        'sky-blue': '#8FB7F5',
        'sage-green': '#A8C8A2',
        'soft-amber': '#E8C47A',
        'muted-coral': '#D98989',

        // Subject Notebook Covers
        'cover-math': '#8EA8D8',
        'cover-physics': '#E7E1D8',
        'cover-chemistry': '#C8CED8',
        'cover-biology': '#B8C8A8',
        'cover-notes': '#D9D2C7',

        // Alias tokens
        surface: '#F7F6F3',
        'surface-dim': '#F2F1EE',
        'surface-bright': '#F7F6F3',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F7F6F3',
        'surface-container': '#ECEAE6',
        'surface-container-high': '#E7E5E1',
        'surface-container-highest': '#D7D4CF',
        'on-surface': '#2E2E2E',
        'on-surface-variant': '#767676',
        outline: '#D7D4CF',
        'outline-variant': '#D7D4CF',
        primary: {
          DEFAULT: '#6B8FD8',
          container: '#2E2E2E',
          'fixed-dim': '#8FB7F5',
          'fixed': '#6B8FD8',
          50: '#F7F6F3',
          100: '#F2F1EE',
          200: '#E7E5E1',
          300: '#8FB7F5',
          400: '#8FB7F5',
          500: '#6B8FD8',
          600: '#5A7EC7',
          700: '#4A6EB6',
          800: '#3A5EA5',
          900: '#2E2E2E',
        },
        'on-primary': '#FFFFFF',
        'on-primary-container': '#767676',
        secondary: {
          DEFAULT: '#767676',
          container: '#ECEAE6',
          fixed: '#E7E5E1',
          'fixed-dim': '#B7B7B7',
        },
        'on-secondary': '#FFFFFF',
        'on-secondary-container': '#2E2E2E',
        'sync-synced': '#A8C8A2',
        'sync-pending': '#E8C47A',
        'sync-offline': '#B7B7B7'
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        'pill-sm': '18px',
        'pill-md': '24px',
        'pill-lg': '32px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Sora', 'Inter', 'sans-serif'],
        sora: ['Sora', 'sans-serif']
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        soft: '0 8px 24px 0 rgba(0, 0, 0, 0.04)',
        glow: '0 8px 20px rgba(107, 143, 216, 0.2)',
        floating: '0 8px 20px rgba(46, 46, 46, 0.04)',
        'lumio-glass': '0 20px 40px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
