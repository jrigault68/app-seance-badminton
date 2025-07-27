export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#EF4444', // Rouge
          secondary: '#1F2937', // Gris foncé
          accent: '#F59E0B', // Orange
          background: '#000000', // Noir
          text: '#FFFFFF', // Blanc
          rose: '#f472b6', // Rose Tailwind par défaut (modifiable)
        },
      },
      animation: {
        slideInLeft: 'slideInLeft 0.25s cubic-bezier(0.4,0,0.2,1) both',
        slideOutLeft: 'slideOutLeft 0.25s cubic-bezier(0.4,0,0.2,1) both',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
