/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          500: "#275efe",
          700: "#1f4ddb",
        },
      },
      boxShadow: {
        card: "0 10px 30px rgba(2, 8, 23, 0.08)",
      },
    },
  },
  plugins: [],
}

