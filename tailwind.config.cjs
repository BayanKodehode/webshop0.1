const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  mode: 'jit',
  
  theme: {
    extend: {
      fontFamily: {
        display: ["Prosto One", ...defaultTheme.fontFamily.sans],
        chatFont: ["Raleway", ...defaultTheme.fontFamily.sans],
      },
      gridAutoRows: {
        '2fr': 'minmax(0, 2fr)',
      },
      transition: {
        "transform": "all 0.2s ease",
        "opacity": "all 0.2s ease"
      },
    },
  },
  plugins: [],
};
