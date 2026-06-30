import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // White base
        canvas: '#FFFFFF',
        surface: '#FAFAFA',
        'surface-2': '#F4F4F5',
        border: '#E7E5E4',
        ink: '#1C1917', // near-black text
        'ink-soft': '#57534E',
        'ink-faint': '#A8A29E',
        // Fire accent palette
        fire: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316', // primary fire orange
          600: '#EA580C',
          700: '#C2410C',
          DEFAULT: '#F97316',
        },
        ember: '#DC2626', // deep red end of gradient
        spark: '#FACC15', // yellow spark highlight
      },
      backgroundImage: {
        'fire-gradient': 'linear-gradient(135deg, #FACC15 0%, #F97316 45%, #DC2626 100%)',
        'fire-gradient-soft': 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
        'fire-radial': 'radial-gradient(circle at 50% 0%, rgba(249,115,22,0.15) 0%, rgba(255,255,255,0) 60%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(28,25,23,0.06), 0 1px 2px rgba(28,25,23,0.04)',
        card: '0 4px 24px rgba(28,25,23,0.08)',
        overlay: '0 24px 80px rgba(28,25,23,0.24)',
        fire: '0 8px 32px rgba(249,115,22,0.32)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      keyframes: {
        'fire-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.08)', opacity: '0.85' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'flame-flicker': {
          '0%, 100%': { transform: 'rotate(-2deg) scale(1)' },
          '50%': { transform: 'rotate(2deg) scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fire-pulse': 'fire-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'flame-flicker': 'flame-flicker 1.2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
