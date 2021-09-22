const TerserPlugin = require("terser-webpack-plugin");
const fs = require('fs')

module.exports = config => {

  config.module.rules = config.module.rules.filter(
    f => f.test.toString() !== '/\\.css$/'
  );

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

  config.resolve.extensions.push('.svg');

  config.module.rules = config.module.rules.map(data => {
    if (/svg\|/.test(String(data.test)))
      data.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/;

    return data;
  });

  if(process.env.NODE_ENV === 'production'){

    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: false,
          extractComments: true
        }),
      ],
    }

    config.module.rules.push(
      {
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    )
  } else {
    const devServer = config.devServer || {}

    config.devServer = {
      ...devServer,
      https: true,
      key: fs.readFileSync(process.env.DEV_SSL_KEY),
      cert: fs.readFileSync(process.env.DEV_SSL_CERT)
    }
  }

  config.module.rules.push({
    test: /\.svg$/,
    enforce: 'pre',
    use: [{ loader: require.resolve('@svgr/webpack'), options: { svgo: false, ref: true } },
    { loader: require.resolve('url-loader') }]
  });

  config.module.rules.push(
    {
      test: /\.(png|jpe?g|gif|webp)$/,
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000, // 10kB
        name: '[name].[hash:7].[ext]',
      },
    })

    return config;
  };