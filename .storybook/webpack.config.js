/**
 * Export a function. Accept the base config as the only param.
 * @param {Object} options
 * @param {Required<import('webpack').Configuration>} options.config
 * @param {'DEVELOPMENT' | 'PRODUCTION'} options.mode - change the build configuration. 'PRODUCTION' is used when building the static version of storybook.
 */
module.exports = async ({ config, mode }) => {

  config.resolve.extensions.push('.svg');

  config.module.rules = config.module.rules.map(data => {
    if (/svg\|/.test(String(data.test)))
      data.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/;

    return data;
  });

  config.module.rules.push({
    test: /\.svg$/,
    enforce: 'pre',
    use: [{ loader: require.resolve('@svgr/webpack'), options: { svgo: false, ref: true } },
    { loader: require.resolve('url-loader') }]
  });

  return config;
};
