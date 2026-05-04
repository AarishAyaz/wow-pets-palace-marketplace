import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './App.tsx',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
theme: {
  extend: {
    colors: {
      primary: "var(--primary)",

      green: {
        500: "var(--color-green-500)",
        600: "var(--color-green-600)",
      },
      red: {
        600: "var(--color-red-600)",
        700: "var(--color-red-700)",
      },
      yellow: {
        500: "var(--color-yellow-500)",
        600: "var(--color-yellow-600)",
      },
      gray: {
        50: "var(--color-gray-50)",
        500: "var(--color-gray-500)",
        600: "var(--color-gray-600)",
      },
    },
  },
},
  plugins: [],
}

export default config