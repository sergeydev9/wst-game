const rootMain = require('../../../.storybook/main');
const path = require('path');

// Use the following syntax to add addons!
// rootMain.addons.push('');
rootMain.stories.push(
  ...['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)']
);
rootMain.addons.push(...[ "@storybook/addon-events",
"@storybook/addon-actions",
'storybook-axios/register',
'storybook-formik/register',
])

rootMain.addons.push('addon-redux')

rootMain.addons.push({
  name: '@storybook/addon-storysource',
  options: {
    rule: {
      test: [/\.stories\.tsx?$/],
      include: [path.resolve(__dirname, '../src')]
    },
    loaders: [
      {
        loader: require.resolve('@storybook/source-loader'),
        options: { parser: 'typescript' },
      },
    ],
  },

});

module.exports = rootMain;
