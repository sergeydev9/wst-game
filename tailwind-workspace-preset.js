module.exports = {
    theme: {
        extend: {
            flex: {
                '2': '2 2 0%',
            },
            transitionProperty: {
                'display': 'display',
                'height':'height'
            },
            translate: {
                'extra': '-115%'
            },

            margin: {
                'btn': '0.1rem'
            },
            width: {
                'p99': '99%', // custom width for buttons. Full width breaks the style.
                '40rem': '40rem',
                '52rem': '52rem',
                '28rem': '28rem'
            },

            fontSize: {
                'large-title': ['42px', { letterSpacing: '-0.02em', lineHeight: '48px' }],
                'title-1': ['32px', { letterSpacing: '-0.02em', lineHeight: '40px' }],
                'title-2': ['26px', { letterSpacing: '-0.02em', lineHeight: '35px' }],
                'title-3': ['20px', { letterSpacing: '-0.02em', lineHeight: '26px' }],
                'body-large': ['32px', { letterSpacing: '-0.02em', lineHeight: '42px' }],
                'body-medium': ['24px', { letterSpacing: '-0.02em', lineHeight: '33px' }],
                'body-small': ['16px', { letterSpacing: '-0.1px', lineHeight: '28px' }],
                'headline': ['16px', { letterSpacing: '-0.02em', lineHeight: '22px' }],
                'label-big': ['16px', { letterSpacing: '0.5px', lineHeight: '24px' }],
                'label-small': ['13px', { letterSpacing: '1.1px', lineHeight: '16px' }]
            },
            // keep this list matched with ThemeColor type in /app-interfaces and /util/colors
            colors: {
                'purple-light': '#8157DB',
                'purple-base': '#6325AD',
                'purple-dark': '#411872',
                'purple-subtle-fill': '#F7F4FB',
                'purple-subtle-stroke': '#E4DFEC',
                'purple-card-bg': '#FCFBFE',
                'yellow-base': '#F2AB3C',
                'yellow-dark': '#3A2403',
                'blue-gradient-from': '#7EADFC',   //
                'blue-gradient-to': '#094BB9',     //   The border effect around the button elements is achieved
                'yellow-gradient-from': 'rgba(245, 201, 131, 1)', //   through a background gradient. Though not part of the design
                'yellow-gradient-to': 'rgba(191, 122, 13, 1)',   //   system, these colors are for those gradients
                'blue-base': '#0F69FF',
                'blue-light': '#4785EB',
                'blue-subtle': '#EDF3FC',
                'off-blue': '#5D5FEF',
                'white-ish': '#FBFBFE',
                'true-white': '#FFFFFF',
                'basic-black': '#190136',
                'basic-gray': '#827991',
                'light-gray': '#F9F9F9',
                'green-base': '#2E6B2E',
                'destructive': 'rgba(167, 11, 0, 1)',
                'green-subtle-stroke': '#DBF0DB',
                'green-subtle-fill': '#F8FCF8',
                'red-base': '#8F3D3D',
                'red-subtle-stroke': '#F0DBDB',
                'red-subtle-fill': '#FCF8F8',
                'red-light': '#A70B00'
            },
            dropShadow: {
                'subtle-stroke': '0 0 0.45rem #D7D8F3',
                'card-container': '0 0 0.6rem #E4E4F7',
                'light': '0 0 0.6rem #EBEBF9',
                'mid': '0 0 0.6rem #ACADEB',
                'card': '0 0 32px #893FE2'
            },
            ringColor: {
                'primary': '#5D5FEF'
            },
            keyframes: {
                grow: {
                    '0%': {transform: 'scale(0)'},
                    '50%': {transform: 'scale(0.5)'},
                    '100%': {transform: 'scale(1)'}
                },
                shrink: {
                    '0%': {transform: 'scale(0)'},
                    '5%': { transoform: 'scale(0.5)'},
                    '10%': { transform: 'scale(1)'},
                    '90%': { transform: 'scale(1)'},
                    '95%': { transoform: 'scale(0.5)'},
                    '100%': {transform: 'scale(0)'}
                }
            },
            animation: {
                grow: 'grow 75ms ease-in-out',
                shrink: 'shrink 2s ease-in-out'

            },
            boxShadow: {
                'active-yellow': 'inset 0px 2px #C17C10',
                'active-blue': 'inset 0px 2px #084AB8',
                'yellow': '0px 2px 0px #C17C10',
                'blue-base': '0px 2px 0px #0F69FF',
                'blue': '0px 2px 0px #084AB8',
                'error': '0px 0px 24px #F6E8E8'
            },
        },
        fontFamily: {
            'sans': ['Nunito'],
            'roboto': ['Roboto']
        }
    },
    variants: {
        extend: {
            boxShadow: ['active'],
            textColor:['active'],
            backgroundColor: ['checked', 'active'],
            borderColor: ['checked', 'active'],
            backgroundImage: ['checked', 'active'],
            gradientColorStops:['active'],
            backgroundClip: ['checked'],
            ringWidth: ['checked'],
            ringColor: ['checked'],
            ringOpacity: ['checked'],
            padding: ['checked', 'active'],
            transitionProperty: ['focus', 'responsive', 'motion-safe', 'motion-reduce']
        }

    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class'
        }),
    ],
};