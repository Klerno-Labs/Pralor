import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050712",
        card: "#0b0f1f",
        accent: "#7c3aed"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      }
    },
  },
  plugins: [],
};

export default config;
