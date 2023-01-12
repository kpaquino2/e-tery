/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: "#8C1C13",
        teal: "#197278",
        cream: "#EDDDD4",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
