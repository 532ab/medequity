/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#eef1ec",
        sand: "#d5dbd2",
        tan: "#D4A27F",
        coral: "#d97757",
        charcoal: "#1c2118",
        lilly: {
          red: "#E21836",
          dark: "#B8132C",
        },
        muted: "#636b5e",
        dark: {
          bg: "#1a1a1d",
          card: "#242427",
          border: "#333338",
          text: "#e4e4e7",
          muted: "#8b8b94",
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
