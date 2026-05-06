/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        piobite: {
          bg: '#FDFBF7',
          surface: '#FFFFFF',
          primary: '#00A86B',
          'primary-hover': '#047857',
          accent: '#FFC107',
          'accent-hover': '#F59E0B',
          text: '#022C22',
          muted: '#4D7C6F',
          border: '#E2E8F0',
          success: '#10B981',
          error: '#EF4444',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
