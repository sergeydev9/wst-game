const rootMain = require('../../../.storybook/main');

// Use the following syntax to add addons!
// rootMain.addons.push('');
rootMain.stories.push(
  ...['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)']
);
rootMain.addons.push(
  ...[
    '@storybook/addon-events',
    'storybook-axios/register',
    'storybook-formik/register',
  ]
);

rootMain.addons.push('addon-redux');

module.exports = rootMain;
