import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Note: token keys (ink/warm/gold) are kept for minimal-risk theming
        // across the codebase — this variant is strict black, white and grey
        // only, with "gold" repurposed as the mid-grey accent/hover tone.
        ink: "#000000",
        paper: "#FFFFFF",
        warm: "#F7F7F7",
        gold: {
          DEFAULT: "#404040",
          light: "#D9D9D9",
          dark: "#1A1A1A",
        },
      },
      fontFamily: {
        display: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(0,0,0,0.14)",
        card: "0 10px 30px -12px rgba(0,0,0,0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        growLine: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards",
        growLine: "growLine 1.2s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
