module.exports = {
    theme: {
        extend: {
            // keep this list matched with ThemeColor type in /app-interfaces and /util/colors
            colors: {
                'purple-light': '#8157DB',
                'purple-base': '#6325AD',
                'purple-dark': '#411872',
                'purple-gradient': '#411872',
                'purple-subtle-fill': '#F7F4FB',
                'purple-subtle-stroke': '#E4DFEC',
                'purple-card-bg': '#FCFBFE',
                'yellow-base': '#F2AB3C',
                'yellow-dark': '#3A2403',
                'blue-base': '#0F69FF',
                'white-ish': '#FBFBFE',
                'true-white': '#FFFFFF',
                'basic-black': '#190136',
                'basic-gray': '#827991',
                'green-base': '#2E6B2E',
                'green-subtle-stroke': '#DBF0DB',
                'green-subtle-fill': '#F8FCF8',
                'red-base': '#8F3D3D',
                'red-subtle-stroke': '#F0DBDB',
                'red-subtle-fill': '#FCF8F8',
                'red-light': '#A70B00'
            },
            dropShadow: {
                'subtle-stroke': '0 0 0.45rem #D7D8F3',
                'light': '0 0 0.6rem #EBEBF9'
            },
            boxShadow: {
                'gameplay': '0px 4px 0px #1012A2'
            },
            ringColor: {
                'primary': '#5D5FEF'
            }
        },
        fontSize: {
            'large-title': ['42px', { letterSpacing: '-0.02em', lineHeight: '48px' }],
            'title-1': ['32px', { letterSpacing: '-0.02em', lineHeight: '40px' }],
            'title-2': ['26px', { letterSpacing: '-0.02em', lineHeight: '35px' }],
            'title-3': ['20px', { letterSpacing: '-0.02em', lineHeight: '26px' }],
            'body-large': ['32px', { letterSpacing: '-0.02em', lineHeight: '42px' }],
            'body-medium': ['24px', { letterSpacing: '-0.02em', lineHeight: '33px' }],
            'body-small': ['16px', { letterSpacing: '-0.1px', lineHeight: '20px' }],
            'headline': ['16px', { letterSpacing: '-0.02em', lineHeight: '22px' }],
            'label-big': ['16px', { letterSpacing: '0.05em', lineHeight: '24px' }],
            'label-small': ['13px', { letterSpacing: '1.1px', lineHeight: '16px' }]
        },
        fontFamily: {
            'sans': ['Nunito'],
            'roboto': ['Roboto']
        },


    },
    variants: {
        extend: {
            backgroundColor: ['checked'],
            borderColor: ['checked'],
            backgroundImage: ['checked'],
            backgroundClip: ['checked'],
            ringWidth: ['checked'],
            ringColor: ['checked'],
            ringOpacity: ['checked'],
            padding: ['checked']
        }

    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class'
        }),
    ],
};