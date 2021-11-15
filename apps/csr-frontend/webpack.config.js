const TerserPlugin = require('terser-webpack-plugin');
const nxConfig = require('@nrwl/react/plugins/webpack')
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;


const zlib = require('zlib');
const fs = require('fs');

module.exports = (config) => {
  config = nxConfig(config);

  config.module.rules = config.module.rules.filter(
    (f) => f.test.toString() !== '/\\.css$/'
  );

  config.module.rules.push({
    test: /\.css$/,
    use: [
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  });

  config.resolve.extensions.push('.svg');

  config.module.rules = config.module.rules.map((data) => {
    if (/svg\|/.test(String(data.test)))
      data.test =
        /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/;

    return data;
  });

  if (process.env.NODE_ENV === 'production') {
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: false,
          extractComments: true,
        }),
      ],
    };

    config.mode = 'production';

    config.plugins = [
      ...config.plugins,
      new BundleAnalyzerPlugin({generateStatsFile: true}),
      new StatoscopeWebpackPlugin( {
        saveReportTo: './statoscope-report.html',
        saveStatsTo: './statoscope-stats.json',
        compressor: 'gzip',
        hash: true, // compilation hash
        entrypoints: true, // entrypoints
        chunks: true, // chunks
        chunkModules: true, // modules
        reasons: true, // modules reason
        nestedModules: true, // concatenated modules
        usedExports: true, // used exports
        providedExports: true, // provided imports
        assets: true, // assets
        chunkOrigins: true, // chunks origins stats (to find out which modules require a chunk)
        version: true, // webpack version
        builtAt: true, // build at time
        timings: true, // modules timing information
        performance: true, // info about

      }),
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        threshold: 10240,
        minRatio: 0.8,
      }),

    ];

    config.module.rules.push({
      test: /\.(ts|js)x?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    });
  } else {
    const devServer = config.devServer || {};

    config.devServer = {
      ...devServer,
      https: true,
      key: fs.readFileSync(process.env.DEV_SSL_KEY),
      cert: fs.readFileSync(process.env.DEV_SSL_CERT),
    };

    config.mode = 'development'
    config.plugins = [
      ...config.plugins,
      new BundleAnalyzerPlugin({
        generateStatsFile: true,
        excludeAssets: new RegExp(/^styles/)}), // exclude styles in dev
      new StatoscopeWebpackPlugin( {
        saveReportTo: './statoscope-report.html',
        saveStatsTo: './statoscope-stats.json',
        compressor: 'gzip',
        hash: true, // compilation hash
        entrypoints: true, // entrypoints
        chunks: true, // chunks
        chunkModules: true, // modules
        reasons: true, // modules reason
        nestedModules: true, // concatenated modules
        usedExports: true, // used exports
        providedExports: true, // provided imports
        assets: true, // assets
        chunkOrigins: true, // chunks origins stats (to find out which modules require a chunk)
        version: true, // webpack version
        builtAt: true, // build at time
        timings: true, // modules timing information
        performance: true, // info about
        watchMode:true
      }),
    ]
    // Hack to enable liveReload
    // REF: https://github.com/nrwl/nx/issues/6506
    config.target = 'web';
  }

  config.module.rules.push({
    test: /\.svg$/,
    enforce: 'pre',
    use: [
      {
        loader: require.resolve('@svgr/webpack'),
        options: { svgo: false, ref: true },
      },
      { loader: require.resolve('url-loader') },
    ],
  });

  config.module.rules.push({
    test: /\.(png|jpe?g|gif|webp)$/,
    loader: require.resolve('url-loader'),
    options: {
      limit: 100000, // 10kB
      name: '[name].[hash:7].[ext]',
    },
  });

  return config;
};
