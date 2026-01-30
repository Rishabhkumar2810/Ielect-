/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: { pink: "#ff00ff", cyan: "#00fff0", blue: "#00b4ff", purple: "#9b5cff", lime: "#c9ff00" },
        bg: { 900: "#0a0b10", 800: "#0d0f1a", 700: "#101225" }
      },
      boxShadow: { neon: "0 0 20px rgba(0, 255, 240, 0.25), 0 0 60px rgba(255, 0, 255, 0.15)" },
      dropShadow: { neon: "0 0 8px rgba(0, 255, 240, .8)" },
      fontFamily: { display: ["Inter","ui-sans-serif","system-ui"] }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
