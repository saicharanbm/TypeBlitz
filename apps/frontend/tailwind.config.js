/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "var(--bgColor)",
        textPrimary: "var(--textPrimary)",
        textSecondary: "var(--textSecondary)",
        primaryColor: "var(--primaryColor)",
      },
    },
  },
  plugins: [],
};
