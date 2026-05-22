/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          primary: '#0F6E56',
          light: '#E6F4F1',
          dark: '#0A5240',
        },
        brand: {
          teal: '#0F6E56',
          amber: '#D97706',
          success: '#059669',
          slate: '#475569',
          dark: '#1E293B',
          border: '#E2E8F0',
          bg: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
