module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: [],
  addons: [
    {
      name: '@storybook/addon-essentials',
      // DM: disabling docs panel because of potential versioning issue with `react-element-to-jsx-string`
      // REF: https://github.com/storybookjs/storybook/issues/12747
      options: {
        docs: false,
      },
    },
  ],
};
