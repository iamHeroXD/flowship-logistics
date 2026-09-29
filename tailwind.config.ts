import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#132238",
          dark: "#0f172a",
          teal: "#1e3a47",
          "teal-hover": "#284b5c",
          mint: "#2ea88b",
          "mint-light": "#e6f6f2",
          surface: "#f0f6f8",
          "surface-alt": "#e8f2f5",
          "surface-pill": "#dbeef5",
          muted: "#64748b",
          border: "#e2e8f0",
        },
      },
      borderRadius: {
        'organic': '36px 12px 36px 12px',
        'organic-alt': '12px 36px 12px 36px',
        'pebble': '40px',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(19, 34, 56, 0.05), 0 2px 6px -1px rgba(19, 34, 56, 0.03)',
        'elevated': '0 12px 32px -4px rgba(19, 34, 56, 0.08), 0 4px 12px -2px rgba(19, 34, 56, 0.04)',
      },
    },
  },
  plugins: [],
};
export default config;
