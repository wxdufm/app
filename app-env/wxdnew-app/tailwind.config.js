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
    //this is where custom styles (colors, fonts, spacing, etc. will be added)
    extend: {},
  },
  //for future plugins that are added
  plugins: [],
}

