import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F8F7FB",      // page background
        surface: "#FFFFFF",     // cards / elevated
        ink: "#0A0A0B",         // headlines + body
        muted: "#6B6B7A",       // secondary text
        rule: "#E5E3EC",        // borders / hairlines
        wisp: "#D8D5EA",        // background gradient tint
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      letterSpacing: {
        wordmark: "-0.015em",
        eyebrow: "0.12em",
        tagline: "0.15em",
      },
      animation: {
        "fade-up": "fade-up 0.95s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 1.15s ease-out both",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
