import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B1020",
        panel: "#121A2F",
        text: "#F5F7FC",
        muted: "#A8B3CF",
        accent: "#6EE7B7",
      },
    },
  },
  plugins: [],
} satisfies Config;
