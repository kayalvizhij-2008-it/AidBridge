/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Mandatory AidBridge Palette
        aid: {
          navy: '#101D32',
          teal: '#176B67',
          'teal-hover': '#135855',
          aqua: '#35A99A',
          ivory: '#F5F3EC',
          white: '#FFFFFF',
          champagne: '#D8B77A',
          text: '#182536',
          muted: '#64748B',
          border: '#E4E8E5',
          'teal-surface': '#E8F3F0',
          success: '#21845A',
          warning: '#D49A35',
          danger: '#C94C4C',
        },
        brand: {
          navy: '#101D32',
          teal: '#176B67',
          aqua: '#35A99A',
          ivory: '#F5F3EC',
          champagne: '#D8B77A',
          50: '#E8F3F0',
          100: '#C7E4DD',
          200: '#94CFC5',
          300: '#5FB6A9',
          400: '#35A99A',
          500: '#176B67',
          600: '#135855',
          700: '#104644',
          800: '#0C3534',
          900: '#101D32',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        glow: '0 0 35px -5px rgba(23, 107, 103, 0.45)',
        'glow-teal': '0 0 35px -5px rgba(23, 107, 103, 0.45)',
        'glow-aqua': '0 0 35px -5px rgba(53, 169, 154, 0.45)',
        'glow-champagne': '0 0 35px -5px rgba(216, 183, 122, 0.45)',
        glass: '0 8px 32px 0 rgba(16, 29, 50, 0.25)',
        card: '0 4px 20px -2px rgba(16, 29, 50, 0.06), 0 2px 6px -1px rgba(16, 29, 50, 0.04)',
        'card-elevated': '0 12px 32px -4px rgba(16, 29, 50, 0.12), 0 4px 12px -2px rgba(16, 29, 50, 0.06)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        shimmer: 'shimmer 2.5s infinite linear',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
