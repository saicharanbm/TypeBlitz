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
        correct: "var(--correct)",
        incorrect: "var(--incorrect)",
      },
      fontFamily: {
        robotoMono: ["Roboto Mono", "monospace"], // Custom font
        robotoSans: ["Roboto", "sans-serif"], // Custom font
      },
      userSelect: {
        none: "none",
      },
    },
  },
  plugins: [],
};
