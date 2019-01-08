const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const HappyPack = require('happypack');
const _ = require('lodash');
const path = require('path');

const BASE_OUTPUT = path.join(__dirname, '../dist');

const devConfig = _.cloneDeep(baseConfig);
const webpackClient = 'webpack-dev-server/client?http://0.0.0.0:3000';
const webpackAddition = 'webpack/hot/only-dev-server';

// manage build cache
devConfig.cache = true;

devConfig.devServer = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
  },
};
// dev source mapping at a higher efficiency since it needs to be recompiled
// on every hot-reload
devConfig.devtool = 'source-map';
devConfig.stats = {
  colors: true,
  modules: true,
  reasons: true,
  errorDetails: true,
};

devConfig.entry = {
  app: [path.join(__dirname, '../src/index'), webpackAddition, webpackClient],
};

devConfig.output.publicPath = 'http://localhost:3000/static/assets/';
devConfig.plugins = devConfig.plugins.concat(
  // dll boosts compilation speed by not rebuilding dependencies

  /* eslint-disable import/no-dynamic-require */
  new webpack.DllReferencePlugin({
    context: '.',
    manifest: require(path.resolve(BASE_OUTPUT, 'vendors-manifest.json')),
  }),
  /* eslint-enable import/no-dynamic-require */

  new webpack.HotModuleReplacementPlugin(),
  // will not error out and compile the specific file if there is a JS error
  // in that file
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      // configuration to deactivate devtools
      DEVTOOLS: JSON.stringify(process.env.DEVTOOLS),
      NODE_ENV: JSON.stringify('dev'),
    },
  })
);

const styleLoaders = [
  {
    // Use Happypack to load sass files. Sass loader config is specified in
    // the "sass" Happypack plugin below.
    test: /\.module.scss$/,
    loader: 'happypack/loader?id=modsass',
  }, {
    test: /^((?!\.module).)*scss$/,
    loader: 'happypack/loader?id=sass',
  }, {
    test: /\.css$/,
    include: /node_modules/,
    loaders: 'happypack/loader?id=cssmods',
  },
];

Array.prototype.push.apply(devConfig.module.loaders, styleLoaders);

// Set the babel query to send to Happypack plugin, which will be used to load
// JS files in place of the babel loader for better build speed
const babelLoaderQuery = _.assign({}, devConfig.module.loaders[0].query, {
  cacheDirectory: true,
});


// happypack loaders

/* eslint-disable prefer-template */
devConfig.plugins = devConfig.plugins.concat([
  new HappyPack({
    id: 'babel',
    loaders: [{
      path: path.join(__dirname, '..',
        'node_modules/babel-loader/lib/index.js'),
      query: '?' + JSON.stringify(babelLoaderQuery),
    }],
  }),
  new HappyPack({
    id: 'sass',
    // Sass does not resolve relative URLs, solutions here:
    // https://github.com/jtangelder/sass-loader#problems-with-url
    loaders: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
  }),
  new HappyPack({
    id: 'modsass',
    // Sass does not resolve relative URLs, solutions here:
    // https://github.com/jtangelder/sass-loader#problems-with-url
    loaders: ['style-loader',
      'css-loader?modules&localIdentName=[local]--[hash:base64:5]',
      'sass-loader', 'postcss-loader'],
  }),
  new HappyPack({
    id: 'cssmods',
    loaders: ['style-loader', 'css-loader'],
  }),
]);
/* eslint-enable prefer-template */

// Replace babel loader with Happypack to improve speed build
devConfig.module.loaders[0] = {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'happypack/loader?id=babel',
};

module.exports = devConfig;
