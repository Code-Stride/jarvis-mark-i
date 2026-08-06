/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stark: {
          cyan: "#00f3ff",
          cyanDark: "#007a80",
          gold: "#ffb703",
          goldDark: "#996e00",
          bg: "#040914",
          panel: "#081226",
          border: "#0e234a",
          alert: "#ff0055",
        }
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(0, 243, 255, 0.4)',
        'cyan-glow-lg': '0 0 30px rgba(0, 243, 255, 0.6)',
        'gold-glow': '0 0 15px rgba(255, 183, 3, 0.4)',
        'alert-glow': '0 0 20px rgba(255, 0, 85, 0.5)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'spin-reverse-slow': 'spinReverse 16s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        }
      }
    },
  },
  plugins: [],
}
