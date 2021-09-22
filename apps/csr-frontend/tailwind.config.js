const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

module.exports = {

    purge: {
        preserveHtmlElements: true,
        content: [...createGlobPatternsForDependencies(__dirname), "./src/**/*.{html,ts,js}"]
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