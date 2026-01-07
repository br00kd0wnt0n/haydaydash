/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hay Day inspired palette
        'hay-gold': '#E8B923',
        'hay-gold-light': '#F5D56A',
        'hay-wheat': '#E8A83A',
        'hay-green': '#5B8C3E',
        'hay-green-light': '#6B9B4D',
        'hay-teal': '#4A9B8C',
        'hay-red': '#B8433E',
        'hay-cream': '#FDF6E3',
        'hay-cream-dark': '#F5ECD3',
        'hay-brown': '#3D2914',
        'hay-brown-light': '#5C4A2E',
      },
      fontFamily: {
        'display': ['Nunito', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
