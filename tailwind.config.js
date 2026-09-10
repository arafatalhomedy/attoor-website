/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#2D3035",
        gold: "#E0A526",
        cream: "#F4F3EF",
      },
    },
  },
  plugins: [],
}