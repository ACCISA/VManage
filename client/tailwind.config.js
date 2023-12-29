/** @type {import('tailwindcss').Config} */
const { colors: defaultColors } = require('tailwindcss/defaultTheme')

const colors = {
  ...defaultColors,
  ...{
    "vm-info-color": {
      "500": "#c2c2da"
    },
  },
}

module.exports = {
  content: ["./src/**/*.{html,js,jsx}",'node_modules/flowbite-react/lib/esm/**/*.js'],
  theme: {
    extend: {},
    colors: colors, 
  },
  plugins: [
    require('flowbite/plugin')
  ]
}