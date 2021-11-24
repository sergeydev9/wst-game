module.exports = {
  theme: {
    extend: {
      screens: {
        'xs': '400px',
      },
      flex: {
        2: '2 2 0%',
      },
      transitionProperty: {
        display: 'display',
        height: 'height',
      },
      translate: {
        extra: '-115%',
        110: '110%',
        'host-action': 'calc(100% - 4rem)',
      },
      margin: {
        btn: '0.1rem',
      },
      inset: {
        p40: '40%',
        p35: '35%',
        p25: '25%',
        p15: '15%',
        p10: '10%',
        p85: '85%',
        "1/10": '10%',
        "2/10": '20%',
        "3/10": '30%',
        "4/10": '40%',
        "5/10": '50%',
        "6/10": '60%',
        "7/10": '70%',
        "8/10": '80%',
        "9/10": '90%',
      },
      width: {
        p99: '99%', // custom width for buttons. Full width breaks the style.
        '40rem': '40rem',
        '52rem': '52rem',
        '28rem': '28rem',
        '4-1/2': '4.5rem',
      },
      height: {
        '32rem': '32rem',
        '36rem': '36rem',
        '4-1/2': '4.5rem',
      },

      fontSize: {
        'large-title': [
          '42px',
          { letterSpacing: '-0.02em', lineHeight: '48px' },
        ],
        'title-1': ['32px', { letterSpacing: '-0.02em', lineHeight: '40px' }],
        'title-2': ['26px', { letterSpacing: '-0.02em', lineHeight: '35px' }],
        'title-3': ['20px', { letterSpacing: '-0.02em', lineHeight: '26px' }],
        'body-large': [
          '32px',
          { letterSpacing: '-0.02em', lineHeight: '42px' },
        ],
        'body-medium': [
          '24px',
          { letterSpacing: '-0.02em', lineHeight: '33px' },
        ],
        'body-small': ['16px', { letterSpacing: '-0.1px', lineHeight: '28px' }],
        headline: ['16px', { letterSpacing: '-0.02em', lineHeight: '22px' }],
        'label-big': ['16px', { letterSpacing: '0.5px', lineHeight: '24px' }],
        'label-small': ['13px', { letterSpacing: '1.1px', lineHeight: '16px' }],
      },
      // keep this list matched with ThemeColor type in /app-interfaces and /util/colors
      colors: {
        'purple-light': '#6B28BB',
        'purple-base': '#431975',
        'purple-dark': '#331359',
        'purple-subtle-fill': '#F7F4FB',
        'purple-subtle-stroke': '#E4DFEC',
        'purple-card-bg': '#FCFBFE',
        'yellow-light': '#F7E08C',
        'yellow-base': '#F4D35C',
        'yellow-dark': '#9C7C0B',
        'yellow-darkest': '#674106', // Not in Colors Figma page, but still listed as text color for secondary small button
        'blue-gradient-from': '#7EADFC',
        'blue-gradient-to': '#094BB9', // The border effect around the button elements is achieved
        'yellow-gradient-from': 'rgba(245, 201, 131, 1)', // through a background gradient. Though not part of the design
        'yellow-gradient-to': 'rgba(191, 122, 13, 1)', // system, these colors are for those gradients
        'blue-light': '#4289FF',
        'blue-base': '#0F69FE',
        'blue-dark': '#003FA8',
        'blue-subtle': '#EDF3FC',
        'pink-light': '#FF33BF',
        'pink-base': '#CC008C',
        'pink-dark': '#770052',
        'green-light': '#04CB83',
        'green-base': '#2E6B2E',
        'green-dark': '#025738',
        'green-subtle-stroke': '#DBF0DB',
        'green-subtle-fill': '#F8FCF8',
        'basic-black': '#190136',
        'basic-gray': '#827991',
        'true-white': '#FFFFFF',
        'off-white': '#FBFBFE',
        'red-base': '#8F3D3D',
        'red-subtle-stroke': '#F0DBDB',
        'red-subtle-fill': '#FCF8F8',

        destructive: 'rgba(167, 11, 0, 1)',

        'light-gray': '#F9F9F9', // Color not in Figma - TOOD: replace
        'off-blue': '#5D5FEF', // Color not in Figma - TOOD: replace
        'white-ish': '#FBFBFE', // Color not in Figma - TOOD: replace all instances with 'off-white'
      },
      dropShadow: {
        pie: '0 0 0.45rem rgba(126, 54, 198, 0.2)',
        'yellow-base': '0 0 0.45rem #F2AB3C',
        'purple-light': '0 0 0.45rem #914FD2',
        'subtle-stroke': '0 0 0.45rem #D7D8F3',
        'card-container': '0 0 0.6rem #E4E4F7',
        light: '0 0 0.6rem #EBEBF9',
        mid: '0 0 0.6rem #ACADEB',
        card: '0 0 0.9rem #893FE2',
      },
      ringColor: {
        primary: '#5D5FEF', // Color not in Figma - TOOD: replace
      },
      keyframes: {
        grow: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(0.5)' },
          '100%': { transform: 'scale(1)' },
        },
        shrink: {
          '0%': { transform: 'scale(0)' },
          '5%': { transoform: 'scale(0.5)' },
          '10%': { transform: 'scale(1)' },
          '90%': { transform: 'scale(1)' },
          '95%': { transoform: 'scale(0.5)' },
          '100%': { transform: 'scale(0)' },
        },
      },
      animation: {
        grow: 'grow 400ms ease-in forwards',
        shrink: 'shrink 2s ease-in-out',
      },
      boxShadow: {
        'rating-button': '0px 4px 0px #BDABE3',
        'active-yellow': 'inset 0px 2px 0px #C17C10',
        'active-blue': 'inset 0px 2px 0px #084AB8',
        yellow: '0px 2px 0px #C17C10',
        'blue-base': '0px 2px 0px #0F69FF',
        blue: '0px 2px 0px #084AB8',
        error: '0px 0px 24px #F6E8E8',
      },
    },
    fontFamily: {
      sans: ['Nunito'],
      roboto: ['Roboto'],
    },
  },
  variants: {
    extend: {
      boxShadow: ['active'],
      textColor: ['active'],
      backgroundColor: ['checked', 'active', 'group-active'],
      borderColor: ['checked', 'active'],
      backgroundImage: ['checked', 'active'],
      gradientColorStops: ['active'],
      backgroundClip: ['checked'],
      ringWidth: ['checked'],
      ringColor: ['checked'],
      ringOpacity: ['checked'],
      padding: ['checked', 'active'],
      transitionProperty: [
        'focus',
        'responsive',
        'motion-safe',
        'motion-reduce',
      ],
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('tailwindcss-interaction-variants'),
  ],
};
