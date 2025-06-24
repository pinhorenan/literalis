export default {
  darkMode: ['class', '[data-theme="dark"]'],
  
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',

        secondary: 'var(--color-secondary)',
        'secondary-light': 'var(--color-secondary-light)',
        'secondary-dark': 'var(--color-secondary-dark)',

        accent: 'var(--color-accent)',
        'accent-strong': 'var(--color-accent-strong)',

        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
        danger: 'var(--color-danger)',

        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          link: 'var(--text-link)',
        },

        surface: {
          bg: 'var(--surface-bg)',
          alt: 'var(--surface-alt)',
          input: 'var(--surface-input)',
          popover: 'var(--surface-popover)',
          elevated: 'var(--surface-elevated)',
          modal: 'var(--surface-modal)',
          card: 'var(--surface-card)',
          'card-hover': 'var(--surface-card-hover)',
        },

        neutral: {
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
        },
      },

      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },

      borderColor: {
        subtle: 'var(--border-subtle)',
        base: 'var(--border-base)',
        strong: 'var(--border-strong)',
        divider: 'var(--divider)',
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      
      spacing: {
        'gap-xs': 'var(--gap-xs)',
        'gap-sm': 'var(--gap-sm)',
        'gap-md': 'var(--gap-md)',
        'gap-lg': 'var(--gap-lg)',
        header: 'var(--size-header)',
        sidebar: 'var(--size-sidebar)',
        footer: 'var(--size-footer)',
      },

      screens: {
        sm: 'var(--bp-sm)',
        md: 'var(--bp-md)',
        lg: 'var(--bp-lg)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar'),
    require('tailwind-animate'),
  ],
}
