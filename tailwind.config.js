/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0e27',
          surface: '#111428',
          border: '#1e223c',
          text: '#e6e7ea',
        },
        accent: '#22d3ee',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
