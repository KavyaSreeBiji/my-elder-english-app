/** @type {application/javascript} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'elder-xl': '1.75rem',
        'elder-2xl': '2.25rem',
        'elder-3xl': '3rem',
      }
    },
  },
  plugins: [],
}