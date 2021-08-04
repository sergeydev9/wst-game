const rootMain = require('../../../.storybook/main');
const path = require('path');

// Use the following syntax to add addons!
// rootMain.addons.push('');
rootMain.stories.push(
  ...['../src/lib/**/*.stories.mdx', '../src/lib/**/*.stories.@(js|jsx|ts|tsx)']
);

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
