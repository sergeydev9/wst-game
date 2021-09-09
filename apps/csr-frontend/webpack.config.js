const nxConfig = require('@nrwl/react/plugins/webpack');
const fs = require('fs')

module.exports = config => {
    const {devServer } = config
    devServer.https = true;
    devServer.key = fs.readFileSync(process.env.DEV_SSL_KEY)
    devServer.cert = fs.readFileSync(process.env.DEV_SSL_CERT)

    config.devServer = {...devServer }
    config = nxConfig(config)
    return config;
  };