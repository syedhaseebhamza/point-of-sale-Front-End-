/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f67f20",
        hover_primary: "#FADDC7",
        secondary: "#0C2D57",
        disabled: "#AFAFAF",

      },
    },
  },
  plugins: [],
};
