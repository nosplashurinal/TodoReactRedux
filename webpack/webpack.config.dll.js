// DLL config is for quicker bundling during development
// Upon hot-reloading, it will not re-bundle vendor libraries

const webpack = require('webpack');
const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');

const BASE_OUTPUT = path.join(__dirname, '../dist');

const dllConfig = {
  entry: {
    vendors: [path.join(__dirname, '../src/vendors')],
  },
  devtool: 'source-map',
  output: {
    path: path.join(BASE_OUTPUT, 'assets'),
    filename: '[name]_[hash].js',
    library: '[name]_[hash]',
  },

  plugins: [
    new BundleTracker({
      path: BASE_OUTPUT,
      filename: 'dll-stats.json',
    }),
    new webpack.DllPlugin({
      path: path.resolve(BASE_OUTPUT, '[name]-manifest.json'),
      name: '[name]_[hash]',
    }),
  ],

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js'],
  },
};

module.exports = dllConfig;
