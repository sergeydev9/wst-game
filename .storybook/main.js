module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: [],
  addons: [
    '@storybook/addon-essentials',
    "@storybook/addon-events",
    "@storybook/addon-actions",
    'storybook-axios/register',
    'storybook-formik/register',
    'addon-redux',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss')
        }
      }
    }
  ],
};
