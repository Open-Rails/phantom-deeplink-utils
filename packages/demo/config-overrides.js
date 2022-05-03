// Webpack 5 no longer handles pollyfills automatically
// This configures react-app-rewired so that we can use browser libraries needed
// to run Solana libraries
const { ProvidePlugin, } = require("webpack");
const ip = require("ip");
const WebpackQRCodePlugin = require('webpack-dev-server-qr-code');
console.log("Your local ip address is-> ", ip.address());

module.exports = function override(config, env) {
  env.REACT_APP_IP = ip.address();
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(m?js|ts)$/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
      ],
    },
    devServer: {
        ...config.devServer,
        /** port MUST be specified */
        port: 3000,
    
        /** Your 'host' value must be '0.0.0.0' for this to work */
        host: '0.0.0.0'
      },
    plugins: [
      ...config.plugins,
      new WebpackQRCodePlugin({ size: 'small' }),
      new ProvidePlugin({
        process: "process/browser",
      }),
    ],
    resolve: {
      ...config.resolve,
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        // "assert": require.resolve("assert"),
        // "http": require.resolve("stream-http"),
        // "https": require.resolve("https-browserify"),
        // "os": require.resolve("os-browserify"),
        // "url": require.resolve("url"),
        // "zlib": require.resolve("browserify-zlib"),
        // "path": require.resolve("path-browserify"),
        // "tty": require.resolve("tty-browserify"),
        // "fs": false
      },
    },
    ignoreWarnings: [/Failed to parse source map/],
  };
};
