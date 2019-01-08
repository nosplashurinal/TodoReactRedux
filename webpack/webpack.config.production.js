const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const cp = require('child_process');
const _ = require('lodash');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const S3Plugin = require('webpack-s3-plugin');

const cdnBasePath = 'https://s3.amazonaws.com/6si-static/aa_ui/';

// extremely IMPORTANT in order to get actual error stacks from
// rollbar
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');

const prodConfig = _.cloneDeep(baseConfig);

let version;
try {
  version = cp.execSync('git rev-parse HEAD', {
    cwd: __dirname,
    encoding: 'utf8',
  });
} catch (err) {
  console.log('Error getting revision', err); // eslint-disable-line no-console
  process.exit(1);
}
version = version.trim();

// much less efficient - but provides full coverage
// for dev building we need speed, here we need stability
prodConfig.devtool = 'source-map';
prodConfig.output.publicPath = `${cdnBasePath + version}/assets/`;
prodConfig.output.filename = '[name]_[chunkhash].js';
prodConfig.output.chunkFilename = '[name]_[chunkhash].chunk.js';

prodConfig.plugins = prodConfig.plugins.concat([
  // hash to break cache between releases
  // we need to use extract text plugin in production
  // otherwise, the regular modules loaders in dev will inject the css
  // inline for reloading benefits - this is not stable and slower for the user
  // so extract text plugin actually creates separate scss files
  new ExtractTextPlugin({ filename: '[name]_[contenthash].css', allChunks: true }),

  // an extremely powerful tool that manages asynchronous loading of code
  // during code splitting... read here:
  // https://webpack.js.org/plugins/commons-chunk-plugin/
  // and understand code splitting here:
  // https://webpack.js.org/guides/code-splitting/
  new webpack.optimize.CommonsChunkPlugin({
    name: 'app',
    minChunks: 2,
    async: true,
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    minimize: true,
    mangle: {
      screw_ie8: true,
    },
    compressor: {
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_console: true,
      screw_ie8: true,
      warnings: false,
    },
    output: {
      comments: false,
    },
  }),

  /* eslint-disable object-shorthand */
  /* eslint-disable prefer-template */
  new RollbarSourceMapPlugin({
    accessToken: process.env.ROLLBAR_ACCESS_KEY_AA_UI,
    version: version,
    publicPath: cdnBasePath + version + '/assets',
  }),
  // /* eslint-enable object-shorthand */
  /* eslint-enable prefer-template */

  // Rollbar source-mapping requires versioning in client calls
  new webpack.DefinePlugin({
    'process.env': {
      DIST_VERSION: JSON.stringify(version),
      NODE_ENV: JSON.stringify('production'),
    },
  }),

  // Upload to s3
  new S3Plugin({
    s3Options: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-east-1',
    },
    s3UploadOptions: {
      Bucket: '6si-static',
      ContentEncoding(filename) {
        // gzip only js files
        if (/\.js/.test(filename)) {
          return 'gzip';
        }
        return null;
      },
    },
    basePath: `aa_ui/${version}/assets`,
  }),

  new CompressionPlugin({
    asset: '[path][query]',
    algorithm: 'gzip',
    deleteOriginalAssets: false,
    test: /\.(js)$/,
    threshold: 0,
    minRatio: 0,
  }),
]);

const styleLoaders = [
  // manage local private css files
  {
    test: /\.module.scss$/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: `css-loader?modules&sourceMap&&
        localIdentName=[local]--[hash:base64:5]!sass-loader!postcss-loader`,
    }),
  },
  // manage public css files with global classes
  {
    test: /^((?!\.module).)*scss$/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader?sourceMap!sass-loader!postcss-loader',
    }),
  },
  //
  {
    test: /\.css$/,
    include: /node_modules/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader?sourceMap!sass-loader!postcss-loader',
    }),
  },
];

Array.prototype.push.apply(prodConfig.module.loaders, styleLoaders);

module.exports = prodConfig;
