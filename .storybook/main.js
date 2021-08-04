module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: [],
  addons: [
    '@storybook/addon-essentials',
    "@storybook/addon-events",
    'storybook-axios/register',
    'storybook-formik/register',
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
