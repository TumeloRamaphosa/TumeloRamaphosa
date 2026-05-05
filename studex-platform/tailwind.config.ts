import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#0a0a0a",
          dark: "#111111",
          pink: "#ff2d78",
          cyan: "#00f0ff",
          magenta: "#ff00ff",
          orange: "#ff6b00",
          purple: "#8b5cf6",
          green: "#00ff88",
          yellow: "#ffd700",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Orbitron", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "flicker": "flicker 3s linear infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        "glitch": "glitch 1s linear infinite",
        "rain": "rain 1s linear infinite",
        "neon-flicker": "neon-flicker 1.5s ease-in-out infinite alternate",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 240, 255, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 240, 255, 0.6)" },
        },
        "flicker": {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": { opacity: "1" },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": { opacity: "0.33" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glitch": {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        "rain": {
          "0%": { transform: "translateY(-100vh)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        "neon-flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": {
            textShadow: "0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #00f0ff, 0 0 80px #00f0ff",
          },
          "20%, 24%, 55%": {
            textShadow: "none",
          },
        },
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "cyber-grid": "50px 50px",
      },
    },
  },
  plugins: [],
};

export default config;
