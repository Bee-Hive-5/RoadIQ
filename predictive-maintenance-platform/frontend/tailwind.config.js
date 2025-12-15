/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // Slate 900
        surface: "#1e293b", // Slate 800
        primary: "#3b82f6", // Blue 500
        accent: "#10b981", // Emerald 500
        danger: "#ef4444", // Red 500
        warning: "#f59e0b", // Amber 500
        "neon-blue": "#00f3ff",
        "neon-purple": "#bc13fe",
      },
      boxShadow: {
        'glow-blue': '0 0 15px rgba(0, 243, 255, 0.3)',
        'glow-purple': '0 0 15px rgba(188, 19, 254, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
