/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utility/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: { cyberpunk: "cyberpunk", slant: "slant", text: "text" },
      backgroundImage: {
        "cyber-container": "url('/CyberDiv.png')",
        "map": "url('/map.jpg')",
      },
      boxShadow: {
        'bottom': '0 4px 6px -1px rgba(192, 242, 237, 0.9)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
