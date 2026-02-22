import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rifc: {
          red: "#DC2626",
          "red-light": "#ef4444",
          blue: "#2563EB",
          green: "#059669",
          amber: "#D97706",
          pink: "#EC4899",
          violet: "#6C3FA0",
        },
        cwAgent: {
          R: "#ef4444",
          I: "#f97316",
          F: "#a855f7",
          C: "#22c55e",
          CTA: "#3d6bff",
        },
        surface: {
          bg: "#0a0a0f",
          card: "rgba(255,255,255,0.02)",
          "card-hover": "rgba(220,38,38,0.02)",
        },
        text: {
          primary: "#e8e6e3",
          secondary: "rgba(232,230,227,0.7)",
          muted: "rgba(232,230,227,0.5)",
          faint: "rgba(232,230,227,0.4)",
          ghost: "rgba(232,230,227,0.3)",
          invisible: "rgba(232,230,227,0.2)",
        },
        border: {
          subtle: "rgba(255,255,255,0.04)",
          light: "rgba(255,255,255,0.06)",
          medium: "rgba(255,255,255,0.08)",
          "red-subtle": "rgba(220,38,38,0.3)",
          "red-medium": "rgba(220,38,38,0.4)",
        },
      },
      fontFamily: {
        heading: ["'Cormorant Garamond'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        "cw-heading": ["'Syne'", "sans-serif"],
        "cw-mono": ["'DM Mono'", "monospace"],
        "cw-serif": ["'Instrument Serif'", "Georgia", "serif"],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fadeUp 1s ease forwards",
        "fade-up-delay-1": "fadeUp 1s ease 0.2s forwards",
        "fade-up-delay-2": "fadeUp 1s ease 0.4s forwards",
        "fade-up-delay-3": "fadeUp 1s ease 0.6s forwards",
        "fade-up-delay-4": "fadeUp 1s ease 0.8s forwards",
        "fade-up-delay-5": "fadeUp 1s ease 1.2s forwards",
        pulse: "pulse 2s ease infinite",
      },
      maxWidth: {
        content: "1100px",
        prose: "760px",
      },
    },
  },
  plugins: [],
};

export default config;
