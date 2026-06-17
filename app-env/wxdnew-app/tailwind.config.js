/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // tells Tailwind which files to scan for class names
    "./App.{js,jsx,ts,tsx}", 
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  //swaps Tailwind's web defaults for ReactNative compativle equivalents

  theme: {
    extend: {
      fontFamily: {
        courier: ['CourierPrime-Regular'],
        'courier-bold': ['CourierPrime-Bold'],
        'courier-italic': ['CourierPrime-Italic'],
      },
    },
  },
  //for future plugins that are added
  plugins: [],
}

