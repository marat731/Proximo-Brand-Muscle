/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'proximo-gold': '#C5A572',
        'proximo-dark': '#1A1A1A',
        'proximo-charcoal': '#2D2D2D',
        'proximo-cream': '#F5F3EF',
        'proximo-red': '#8B2635',
        'proximo-blue': '#1E3A5F',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
