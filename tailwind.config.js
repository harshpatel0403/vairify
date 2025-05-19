/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "375px",
        'max-sm': { 'max': '640px' },
      },
      colors: {
        blue:'#060C4D'
      }
    },
  },
  plugins: [],
};
