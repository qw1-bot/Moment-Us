/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cheese: "#FFFDF2",
        primary: "#FFB7B2",
        roseBrown: "#7D5A5A",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(255, 183, 178, 0.18)",
      },
      animation: {
        jelly: "jelly 0.28s ease-out",
      },
      keyframes: {
        jelly: {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(0.92, 1.04)" },
          "65%": { transform: "scale(1.02, 0.98)" },
          "100%": { transform: "scale(1)" },
        },
      },
      fontFamily: {
        cute: ["ui-rounded", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
