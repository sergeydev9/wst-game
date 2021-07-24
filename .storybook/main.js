module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: [],
  addons: ['@storybook/addon-essentials', {
    name: '@storybook/addon-postcss',
    options: {
      postcssLoaderOptions: {
        implementation: require('postcss')
      }
    }
  }],
};
