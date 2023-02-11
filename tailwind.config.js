/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
        'primary' : '#61CA77',
        'primaryLight' : '#F5FFF7',
        'secondary' : '#F6B445',
        'Black' : '#060606',
        'Gray' : '#727272',
        'White' : '#FFFFFF',
      },
    },
  },
  plugins: [],
}
