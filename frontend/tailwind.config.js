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
        // Used by the News Ticker's desktop speed — left as-is, only the
        // developer marquee's desktop pace was asked to speed up.
        'marquee': 'marquee 40s linear infinite',
        // Developer logo marquee's own desktop speed (separate from the
        // ticker's `marquee` above, so changing this doesn't also change
        // the ticker). Slowed back down from 18s per request.
        'marquee-fast': 'marquee 30s linear infinite',
        // Developer logo marquee's mobile speed. 4s cycled all 17 logos so
        // fast individual ones couldn't actually be registered — reads as
        // "not showing all" even though every logo is in the DOM and does
        // scroll past. Slowed down enough to actually perceive each one.
        'marquee-mobile': 'marquee 12s linear infinite',
        // News Ticker's mobile speed — this is read text, not glanced-at
        // icons, so it needs to stay slow enough to actually read. Separate
        // from marquee-mobile above so the two can be tuned independently.
        'marquee-ticker-mobile': 'marquee 25s linear infinite',
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
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': '#737575',
            '--tw-prose-headings': '#000219',
            '--tw-prose-links': '#CDA773',
            '--tw-prose-bold': '#000219',
            '--tw-prose-bullets': '#E1B77E',
            '--tw-prose-quotes': '#000219',
            '--tw-prose-quote-borders': '#E1B77E',
            '--tw-prose-hr': '#EEEEEE',
            maxWidth: 'none',
            a: { textDecoration: 'none', fontWeight: '500' },
            'a:hover': { textDecoration: 'underline' },
            'h1, h2, h3, h4': { fontFamily: 'var(--font-cormorant), Georgia, serif', fontWeight: '600' },
          },
        },
      }),
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
