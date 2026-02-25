module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#f4f4f5",
        card: "#18181b",
        "card-foreground": "#f4f4f5",
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#14b8a6",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#27272a",
          foreground: "#a1a1aa",
        },
        accent: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
        border: "#27272a",
        input: "#27272a",
        ring: "#6366f1",
        sleep: {
          wake: "#f97316",
          rem: "#a855f7",
          light: "#3b82f6",
          deep: "#1e40af",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};