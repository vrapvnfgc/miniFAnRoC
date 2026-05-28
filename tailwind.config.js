/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Orbitron"', 'monospace'],
        body: ['"Exo 2"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cyber: {
          50:  '#edfcff',
          100: '#d6f7ff',
          200: '#a5f0ff',
          300: '#63e4ff',
          400: '#18cffa',
          500: '#00b4e6',
          600: '#008fc3',
          700: '#00719e',
          800: '#065c81',
          900: '#0a4d6b',
          950: '#063347',
        },
        violet: {
          50:  '#f5f0ff',
          100: '#ede5ff',
          200: '#dcceff',
          300: '#c4a9ff',
          400: '#a87aff',
          500: '#8b47ff',
          600: '#7a28f7',
          700: '#681ae3',
          800: '#5717bc',
          900: '#491499',
          950: '#2d0a6b',
        },
        neon: {
          cyan:   '#00f5ff',
          purple: '#bf00ff',
          blue:   '#0077ff',
        },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ea5e9' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'hero-gradient': 'linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 30%, #0f0a2e 60%, #080d1c 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(0,180,230,0.08) 0%, rgba(139,71,255,0.08) 100%)',
        'glow-cyan':   'radial-gradient(ellipse at center, rgba(0,245,255,0.15) 0%, transparent 70%)',
        'glow-purple': 'radial-gradient(ellipse at center, rgba(191,0,255,0.12) 0%, transparent 70%)',
      },
      animation: {
        'fade-in':      'fadeIn 0.6s ease-out forwards',
        'slide-up':     'slideUp 0.6s ease-out forwards',
        'slide-in-left':'slideInLeft 0.6s ease-out forwards',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
        'scan-line':    'scanLine 4s linear infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'border-flow':  'borderFlow 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,245,255,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(0,245,255,0.6), 0 0 60px rgba(139,71,255,0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-15px)' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        borderFlow: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      boxShadow: {
        'glow-sm':  '0 0 10px rgba(0,180,230,0.4)',
        'glow-md':  '0 0 25px rgba(0,180,230,0.4), 0 0 50px rgba(139,71,255,0.2)',
        'glow-lg':  '0 0 40px rgba(0,180,230,0.5), 0 0 80px rgba(139,71,255,0.3)',
        'inset-glow': 'inset 0 0 30px rgba(0,180,230,0.1)',
      },
    },
  },
  plugins: [],
};
