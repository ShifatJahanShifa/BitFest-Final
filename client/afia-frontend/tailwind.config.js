/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
     "./node_modules/flowbite/**/*.js",
  ],
  
  theme: {
    extend: {
      colors: {
        chart: {
          1: 'var(--color-chrome)',
          2: 'var(--color-safari)',
          3: 'var(--color-firefox)',
          4: 'var(--color-edge)',
          5: 'var(--color-other)',
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin')({
      wysiwyg: true,
  }),
  ],

  
}

