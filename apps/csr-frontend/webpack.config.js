const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const zlib = require("zlib");
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

    config.plugins = [
      ...config.plugins,
      new CompressionPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
        new CompressionPlugin({
          filename: "[path][base].br",
          algorithm: "brotliCompress",
          test: /\.(js|css|html|svg)$/,
          compressionOptions: {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
            },
          },
          threshold: 10240,
          minRatio: 0.8,
        })
    ]

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
        limit: 100000, // 10kB
        name: '[name].[hash:7].[ext]',
      },
    })

    return config;
  };