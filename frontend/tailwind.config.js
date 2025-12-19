/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background-color)',
        'text-primary': 'var(--text-color)',
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        'card-bg': 'var(--card-bg)',
        'navbar-bg': 'var(--navbar-bg)',
        'navbar-text': 'var(--navbar-text)',
        'footer-bg': 'var(--footer-bg)',
        'footer-text': 'var(--footer-text)',
      }
    },
  },
  plugins: [],
}