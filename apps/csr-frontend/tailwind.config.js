const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

module.exports = {

    purge: createGlobPatternsForDependencies(__dirname),
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