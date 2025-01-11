/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#7a8ed0",
        "secondary": "#cdd3f5",
        "tertiary": "#8c99bb",
        "border": "#b8c3d3",
      },
      backgroundImage: {
        "custom-image": "url('/images/bg3.jpg')",
      },
    },
  },
  plugins: [],
}

