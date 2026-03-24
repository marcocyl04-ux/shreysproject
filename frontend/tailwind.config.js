/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Silent Luxury - Midnight Spectrum
        surface: {
          base: '#121315',
          lowest: '#0D0E0F',
          low: '#1A1B1E',
          high: '#1E2024',
          bright: '#25282D',
        },
        primary: {
          DEFAULT: '#00FF94',
          container: '#00FF94',
          text: '#F2FFF1',
          dim: '#00CC76',
        },
        secondary: {
          DEFAULT: '#B00038',
          container: '#B00038',
          text: '#FFB2B8',
        },
        outline: {
          DEFAULT: 'rgba(255,255,255,0.1)',
          variant: 'rgba(255,255,255,0.05)',
        }
      },
      fontFamily: {
        'editorial': ['Newsreader', 'Georgia', 'serif'],
        'technical': ['Inter', 'system-ui', 'sans-serif'],
        'data': ['Space Grotesk', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        'ambient': '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 40px rgba(0, 255, 148, 0.15)',
      },
    },
  },
  plugins: [],
}
