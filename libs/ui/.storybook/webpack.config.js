const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const rootWebpackConfig = require('../../../.storybook/webpack.config');
/**
 * Export a function. Accept the base config as the only param.
 *
 * @param {Parameters<typeof rootWebpackConfig>[0]} options
 */
module.exports = async ({ config, mode }) => {
  config = await rootWebpackConfig({ config, mode });

  const tsPaths = new TsconfigPathsPlugin({
    configFile: './tsconfig.base.json',
  });

  config.resolve.plugins
    ? config.resolve.plugins.push(tsPaths)
    : (config.resolve.plugins = [tsPaths]);

  // Found this here: https://github.com/nrwl/nx/issues/2859
  // And copied the part of the solution that made it work

  // const svgRuleIndex = config.module.rules.findIndex((rule) => {
  //   const { test } = rule;

  //   if(test){
  //     return test.toString().startsWith('/\\.(svg|ico');
  //   } else 
  // });
  // config.module.rules[svgRuleIndex].test =
  //   /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/;

  config.module.rules.push({
    test: /\.css$/,
    use: [
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
        }
      }
    ],
  })

  config.module.rules.push(
    {
      test: /\.(png|jpe?g|gif|webp)$/,
      loader: require.resolve('url-loader'),
      options: {
        limit: 100000, // 100kB
        name: '[name].[hash:7].[ext]',
      },
    }
  );

  return config;
};