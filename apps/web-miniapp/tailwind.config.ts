import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base:    "#0b0f1a",
        surface: { DEFAULT: "#161b2e", 2: "#1e2540" },
        primary: { DEFAULT: "#6366f1", light: "#818cf8", dark: "#4f46e5" },
        accent:  "#a855f7",
        warm:    { DEFAULT: "#f59e0b", glow: "rgba(245,158,11,0.22)" },
        blue:    "#3b82f6",
        text:    { 1: "#e2e8f0", 2: "#94a3b8", 3: "#475569" },
        success: "#10b981",
        error:   "#ef4444",
        border:  { subtle: "rgba(255,255,255,0.08)" },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
