/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBlue: "#102C57",
        lightBlue: "#1679AB",
        darkPink: "#FFB1B1",
        lightPink: "#FFCBCB",
      },
    },
    fontFamily: {
      sans: ["Montserrat"],
    },
  },
  plugins: [],
};
