// tailwind.config.js

const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'], // update paths as needed
  theme: {
    extend: {
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
      }, keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }, float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
},
      colors: {
        background: 'hsl(240, 10%, 3.9%)',
        foreground: 'hsl(0, 0%, 98%)',
        primary: 'hsl(217, 91%, 60%)',
        'primary-glow': 'hsl(217, 91%, 70%)',
        secondary: 'hsl(270, 95%, 75%)',
        accent: 'hsl(177, 70%, 41%)',
        muted: 'hsl(240, 3.7%, 15.9%)',
        border: 'hsl(240, 3.7%, 15.9%)',
        destructive: 'hsl(0, 84.2%, 60.2%)',
      },
    },
  },
  plugins: [],
}
