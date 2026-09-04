/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Government design language colors
        gov: {
          green: '#006400', // Deep government green
          light: '#f9fafb',
          border: '#e5e7eb',
          text: '#111827',
          muted: '#6b7280'
        }
      }
    },
  },
  plugins: [],
}
