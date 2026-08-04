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
        surface: '#f6fafe',
        'surface-dim': '#d6dade',
        'surface-bright': '#f6fafe',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f0f4f8',
        'surface-container': '#eaeef2',
        'surface-container-high': '#e4e9ed',
        'surface-container-highest': '#dfe3e7',
        'on-surface': '#171c1f',
        'on-surface-variant': '#45474c',
        'inverse-surface': '#2c3134',
        'inverse-on-surface': '#edf1f5',
        outline: '#75777d',
        'outline-variant': '#c5c6cd',
        'surface-tint': '#545f73',
        primary: {
          DEFAULT: '#091426',
          container: '#1e293b',
          'fixed-dim': '#bcc7de',
          'fixed': '#d8e3fb',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#091426',
        },
        'on-primary': '#ffffff',
        'on-primary-container': '#8590a6',
        secondary: {
          DEFAULT: '#835500',
          container: '#feae2c',
          fixed: '#ffddb4',
          'fixed-dim': '#ffb955',
        },
        'on-secondary': '#ffffff',
        'on-secondary-container': '#6b4500',
        tertiary: {
          DEFAULT: '#001906',
          container: '#003010',
          fixed: '#6bff8f',
          'fixed-dim': '#4ae176',
        },
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#00a64a',
        darkblue: {
          800: '#0f172a',
          900: '#0b0f19',
          950: '#05070d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
        sora: ['Sora', 'sans-serif']
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'academic-sm': '0px 4px 20px rgba(15, 23, 42, 0.05)',
        'academic-lg': '0px 10px 30px rgba(15, 23, 42, 0.08)'
      }
    },
  },
  plugins: [],
}
