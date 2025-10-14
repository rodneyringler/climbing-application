import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        // Earth tone color palette
        terracotta: {
          400: '#C1554D',
          500: '#A0483F',
          600: '#8B3A33',
        },
        brown: {
          400: '#8B6F47',
          500: '#6B563D',
          600: '#5A4530',
        },
        sage: {
          400: '#7A8B70',
          500: '#5C6B52',
          600: '#4A553F',
        },
        stone: {
          100: '#E8DDD2',
          200: '#D4C5B3',
          300: '#C0B19A',
          400: '#A69B7F',
        },
        // Keep blue for compatibility but add earth tones as primary
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
