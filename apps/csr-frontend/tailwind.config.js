const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

module.exports = {

    purge: {
        enable: true,
        preserveHtmlElements: true,
        content: [...createGlobPatternsForDependencies(__dirname), "./apps/csr-frontend/src/**/*.{html,ts,tsx,jsx,js}"]
    },

    presets: [require('../../tailwind-workspace-preset.js')],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },

    variants: {

        extend: {},

    },
    plugins: [],
};