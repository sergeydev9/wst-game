module.exports = {
    theme: {
        extend: {
            colors: {
                'primary': "#5D5FEF", // toggle component needs to be manually kept in sync with this value since it has to use css classes
                'subtle-primary': "#F2F2FB",
                'subtle-stroke': "#D7D8F3",
                'subtle-bg': "#FBFBFE",
                'white-ish': "#FBFBFE",
                'true-white': "#FFFFFF",
                'basic-black': "#0D020E",
                'green-base': "#2E6B2E",
                'green-subtle-stroke': "#DBF0DB",
                'green-subtle': "#F8FCF8",
                'red-base': "#8F3D3D",
                'red-subtle-stroke': "#F0DBDB",
                'red-subtle': "#FCF8F8",
                'red-light': "#A70B00"
            },
            dropShadow: {
                'subtle-stroke': '0 0 0.45rem #D7D8F3'
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