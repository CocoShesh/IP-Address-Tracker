/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "desktop-background": "url('/pattern-bg-desktop.png')",
        "mobile-background": "url('/pattern-bg-mobile.png')",
      },
    },
  },
  plugins: [],
};
