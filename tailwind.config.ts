import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        theme_gray: "#313338",
        theme_black: "#1E1F22",
        theme_purple: "#4752C4",
        theme_toast_dark_background: "#15182B",
        theme_red: "#DF2E38",
        theme_green: "#6BF178",
        theme_blue: "#1F6BFF",
        theme_yellow: "#E8C547",
      },
    },
  },
  plugins: [],
};
export default config;
