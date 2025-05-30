import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          // Shades of dark - customize as needed
          DEFAULT: '#121212',
        
        },
      },
      
      
    },
  },
  plugins: [],
  darkMode: 'class', // or 'media' based on your preference
};

export default config;