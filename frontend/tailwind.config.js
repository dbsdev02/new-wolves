/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#E1B77E',
          soft: '#E7C598',
          deep: '#CDA773',
          pale: '#F8EFE3',
        },
        ink: {
          DEFAULT: '#000219',
          soft: '#000857',
          muted: '#0B2339',
        },
        cream: {
          DEFAULT: '#E6E7F5',
          dark: '#DEE0F0',
        },
        muted: '#737575',
        border: '#EEEEEE',
        luxury: {
          black: '#000219',
          dark: '#000857',
          charcoal: '#0B2339',
          light: '#E6E7F5',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, var(--gold-soft) 0%, var(--gold) 50%, var(--gold-deep) 100%)',
        'gradient-dark': 'linear-gradient(135deg, var(--ink) 0%, var(--ink-soft) 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'reveal': 'revealUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'reveal-fade': 'revealFade 1.4s ease-out both',
        'slow-zoom': 'slowZoom 12s ease-out both',
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        revealUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        revealFade: { from: { opacity: '0' }, to: { opacity: '1' } },
        slowZoom: { from: { transform: 'scale(1.08)' }, to: { transform: 'scale(1)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(225, 183, 126, 0.3)',
        'gold-lg': '0 8px 40px rgba(225, 183, 126, 0.4)',
        'luxury': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
