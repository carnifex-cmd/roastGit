import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      fontSize: {
        display: ["3.25rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        headline: ["2.15rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        body: ["1rem", { lineHeight: "1.7" }],
        micro: ["0.68rem", { lineHeight: "1.4", letterSpacing: "0.32em" }]
      },
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        mist: "rgb(var(--color-mist) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(20, 20, 20, 0.08)",
        lift: "0 12px 30px rgba(20, 20, 20, 0.1)"
      },
      letterSpacing: {
        tightish: "-0.02em"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" }
        }
      },
      animation: {
        "fade-in": "fadeIn 600ms ease forwards",
        "fade-out": "fadeOut 500ms ease forwards"
      }
    }
  },
  plugins: []
};

export default config;
