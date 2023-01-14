/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        accepted: "url('/graphics/accepted.png')",
        delivery: "url('/graphics/delivery.png')",
        features: "url('/graphics/features.png')",
        lost: "url('/graphics/lost.png')",
        notallowed: "url('/graphics/notallowed.png')",
        pickedup: "url('/graphics/pickedup.png')",
        prepared: "url('/graphics/prepared.png')",
        waiting: "url('/graphics/waiting.png')",
        welcome: "url('/graphics/welcome.png')",
      },
      colors: {
        maroon: "#8C1C13",
        teal: "#197278",
        cream: "#EDDDD4",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
