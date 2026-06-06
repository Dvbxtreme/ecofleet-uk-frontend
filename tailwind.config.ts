import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#1e4d8c', 700: '#1a365d', 800: '#153e75', 900: '#0f2c5e' },
        fors: { silver: '#9ca3af', gold: '#f59e0b' },
      },
    },
  },
  plugins: [],
}
export default config
