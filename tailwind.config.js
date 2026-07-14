/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        luxury: {
          black: {
            pure: "var(--background-color-pure, #000000)",
            DEFAULT: "var(--background-color, #030303)",
            card: "var(--card-color, #09090b)",
            elevated: "var(--elevated-color, #121214)",
            border: "var(--border-color, #1a1a1e)",
          },
          gold: {
            DEFAULT: "var(--primary-color, #C5A880)",
            light: "var(--primary-light-color, #E6D5B8)",
            dark: "var(--primary-dark-color, #8C7853)",
            bright: "var(--primary-hover-color, #D4AF37)",
            muted: "var(--primary-muted-color, #5c4f3c)",
          },
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Playfair Display", ...defaultTheme.fontFamily.serif],
        sans: ["Outfit", "Inter", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "border-glow": "borderGlow 4s ease infinite",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "var(--border-color-glow-start, rgba(197, 168, 128, 0.2))" },
          "50%": { borderColor: "var(--border-color-glow-end, rgba(197, 168, 128, 0.6))" },
        },
      },
      boxShadow: {
        "luxury-gold": "0 4px 20px -2px var(--shadow-glow-color, rgba(197, 168, 128, 0.15))",
        "luxury-glow": "0 0 15px var(--ambient-glow-color, rgba(197, 168, 128, 0.1))",
      },
    },
  },
  plugins: [
    addVariablesForColors,
  ],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
