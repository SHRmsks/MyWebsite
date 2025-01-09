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
      screens: {
        "sm-dpr-1": {raw: `(min-width: 640px) and  (min-device-pixel-ratio: 1) and (max-device-pixel-ratio: 1.99),  (min-width: 640px) and (-webkit-min-device-pixel-ratio: 1) and (-webkit-max-device-pixel-ratio: 1.99)`},

        "sm-dpr-2": {raw: `
        (min-width: 640px) and (min-device-pixel-ratio: 2) and (max-device-pixel-ratio: 2.99),
        (min-width: 640px) and (-webkit-min-device-pixel-ratio: 2) and (-webkit-max-device-pixel-ratio: 2.99)
      `},
        "sm-dpr-3": {raw: `(min-width: 640px) and  (min-device-pixel-ratio: 3), (min-width: 640px) and (-webkit-min-device-pixel-ratio: 3)`},

        "md-dpr-1": {raw: `(min-width: 768px) and  (min-device-pixel-ratio: 1) and (max-device-pixel-ratio: 1.99),  (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) and (-webkit-max-device-pixel-ratio: 1.99)`},
      
        "md-dpr-2": { raw: `
        (min-width: 768px) and (min-device-pixel-ratio: 2) and (max-device-pixel-ratio: 2.99),
        (min-width: 768px) and (-webkit-min-device-pixel-ratio: 2) and (-webkit-max-device-pixel-ratio: 2.99)
      `,
       
},
        "md-dpr-3": {raw: `(min-width: 768px) and  (min-device-pixel-ratio: 3), (min-width: 768px) and (-webkit-min-device-pixel-ratio: 3)`},
        
        "lg-dpr-1": {raw: `(min-width: 1024px) and  (min-device-pixel-ratio: 1) and (max-device-pixel-ratio: 1.99),  (min-width: 1024px) and (-webkit-min-device-pixel-ratio: 1) and (-webkit-max-device-pixel-ratio: 1.99)`},
        "lg-dpr-2": {raw: `(min-width: 1024px) and  (min-device-pixel-ratio: 2) and (max-device-pixel-ratio: 2.99),  (min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (-webkit-max-device-pixel-ratio: 2.99)`},
        "lg-dpr-3": {raw: `(min-width: 1024px) and  (min-device-pixel-ratio: 3),  (min-width: 1024px) and (-webkit-min-device-pixel-ratio: 3)`},
        "xl-dpr-1": {raw: `(min-width: 1280px) and  (min-device-pixel-ratio: 1) and (max-device-pixel-ratio: 1.99),  (min-width: 1280px) and (-webkit-min-device-pixel-ratio: 1) and (-webkit-max-device-pixel-ratio: 1.99)`},
          "xl-dpr-2": {raw: `(min-width: 1280px) and  (min-device-pixel-ratio: 2) and (max-device-pixel-ratio: 2.99),  (min-width: 1280px) and (-webkit-min-device-pixel-ratio: 2) and (-webkit-max-device-pixel-ratio: 2.99)`},
        "xl-dpr-3": {raw: `(min-width: 1280px) and  (min-device-pixel-ratio: 3),  (min-width: 1280px) and (-webkit-min-device-pixel-ratio: 3)`},
        "xxl-dpr-1": {raw: `(min-width: 1920px) and  (min-device-pixel-ratio: 1) and (max-device-pixel-ratio: 1.99),  (min-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) and (-webkit-max-device-pixel-ratio: 1.99)`},
        "xxl-dpr-2": {raw: `(min-width: 1920px) and  (min-device-pixel-ratio: 2) and (max-device-pixel-ratio: 2.99),  (min-width: 1920px) and (-webkit-min-device-pixel-ratio: 2) and (-webkit-max-device-pixel-ratio: 2.99)`},
        "xxl-dpr-3": {raw: `(min-width: 1920px) and  (min-device-pixel-ratio: 3),  (min-width: 1920px) and (-webkit-min-device-pixel-ratio: 3)`},
        "xxxl-dpr-1": {raw: `(min-width: 2560px) and  (min-device-pixel-ratio: 1) and (max-device-pixel-ratio: 1.99),  (min-width: 2560px) and (-webkit-min-device-pixel-ratio: 1) and (-webkit-max-device-pixel-ratio: 1.99 )`},
        "xxxl-dpr-2": {raw: `(min-width: 2560px) and  (min-device-pixel-ratio: 2) and (max-device-pixel-ratio: 2.99),  (min-width: 2560px) and (-webkit-min-device-pixel-ratio: 2) and (-webkit-max-device-pixel-ratio: 2.99)`},
        "xxxl-dpr-3": {raw: `(min-width: 2560px) and  (min-device-pixel-ratio: 3),  (min-width: 2560px) and (-webkit-min-device-pixel-ratio: 3)`},

      },
      fontFamily: { cyberpunk: "cyberpunk", slant: "slant", text: "text", glitch: "glitch", introText: "introText"},
      backgroundImage: {
        "cyber-container": "url('/CyberDiv.png')",
        "map": "url('/map.jpg')",
      },
      boxShadow: {
        'bottom': '0 4px 6px -1px rgba(192, 242, 237, 0.9)',
       
      },
      dropShadow: {
         'text_bottom': '0 1.2px 2px rgba(192, 242, 237, 0.9)'
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
