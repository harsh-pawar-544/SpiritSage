/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f8fafc',
          dark: '#0f172a'
        },
        primary: {
          DEFAULT: '#4f46e5',
          dark: '#6366f1'
        },
        text: {
          light: '#1e293b',
          dark: '#f1f5f9'
        }
      }
    },
  },
  plugins: [],
}