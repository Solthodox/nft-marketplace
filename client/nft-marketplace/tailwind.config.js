/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors:{
      "main":"#0f172a",
      "secondary":"#ecfeff",
      "theme":"#3b82f6"
    },
    fontFamily:{
      "nunito":["Nunito","sans-serif"]
    },
    extend: {},
  },
  plugins: [],
}