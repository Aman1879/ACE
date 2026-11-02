/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6B00',
          'orange-light': '#FFF1E6',
          green: '#57C76F',
          'green-light': '#F3FBF3',
          bg: '#FFFDF8',
          border: '#EAEAEA',
          text: '#1B1B1B',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Poppins', 'Inter', 'Manrope', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
        orange: '0 4px 20px rgba(255,107,0,0.25)',
        green: '0 4px 20px rgba(87,199,111,0.25)',
      },
    },
  },
  plugins: [],
};

