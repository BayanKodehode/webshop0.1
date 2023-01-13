const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Prosto One", ...defaultTheme.fontFamily.sans],
        chatFont: ["Raleway", ...defaultTheme.fontFamily.sans],
      },
      transition: {
        "transform": "all 0.2s ease",
        "opacity": "all 0.2s ease"
      },
    },
    

  },
  plugins: [],
};
