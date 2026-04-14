/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        accent: "#22C55E",
        dark: "#111827",
        surface: "#F9FAFB",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
      },
      fontSize: {
        h1: ["48px", { lineHeight: "1.15", fontWeight: "600", letterSpacing: "-0.02em" }],
        h2: ["32px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.02em" }],
        h3: ["22px", { lineHeight: "1.25", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6" }],
        small: ["14px", { lineHeight: "1.5" }],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 23, 42, 0.08)",
        card: "0 4px 24px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 12px 40px rgba(37, 99, 235, 0.12)",
      },
      keyframes: {
        "logo-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "typing-dot": {
          "0%, 80%, 100%": { opacity: "0.35", transform: "scale(0.85)" },
          "40%": { opacity: "1", transform: "scale(1)" },
        },
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-8deg)" },
          "60%": { transform: "rotate(14deg)" },
          "80%": { transform: "rotate(0deg)" },
        },
        "orbit-spin": {
          to: { transform: "rotate(360deg)" },
        },
        "hero-in": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "chat-pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(37, 99, 235, 0.45)" },
          "70%": { boxShadow: "0 0 0 14px rgba(37, 99, 235, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(37, 99, 235, 0)" },
        },
        "home-blob": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(24px, -18px) scale(1.05)" },
          "66%": { transform: "translate(-16px, 12px) scale(0.95)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "logo-shift": "logo-shift 5s ease-in-out infinite",
        "typing-dot": "typing-dot 1s ease-in-out infinite",
        wave: "wave 2.5s ease-in-out infinite",
        "orbit-spin": "orbit-spin linear infinite",
        "hero-in": "hero-in 0.75s ease-out forwards",
        "chat-pulse": "chat-pulse-ring 2s ease-out infinite",
        "home-blob": "home-blob 22s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marquee-reverse 50s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
