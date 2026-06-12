import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          background: "#F8F5EF",
          text: "#1F2933",
          muted: "#667085",
          primary: "#183B56",
          accent: "#B88A44",
          softAccent: "#EFE3D0",
          white: "#FFFFFF",
          border: "#E5E0D8"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Georgia", "Cambria", "Times New Roman", "serif"]
      },
      boxShadow: {
        card: "0 18px 48px rgba(31, 41, 51, 0.08)",
        soft: "0 24px 80px rgba(24, 59, 86, 0.10)"
      }
    }
  },
  plugins: []
};
export default config;
