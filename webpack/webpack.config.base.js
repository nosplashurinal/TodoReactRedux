const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const BundleTracker = require('webpack-bundle-tracker');

const BASE_OUTPUT = path.join(__dirname, '../dist');

const webpackConfig = {
  entry: {
    app: [path.join(__dirname, '../src/index')],
  },
  output: {
    path: path.join(BASE_OUTPUT, 'assets'),
    filename: '[name]_[hash].js',
  },
  resolve: {
    modules: ['node_modules', 'src'],
    alias: {
      moment$: 'moment/moment.js',
    },
    extensions: ['.js'],
  },
};

webpackConfig.plugins = [
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer,
      ],
    },
  }),
  // realtime stats on bundling. Look at this file for errors and
  // correct mappping
  new BundleTracker({
    path: BASE_OUTPUT,
    filename: 'stats.json',
  }),

  // We will inevitably use moment as all libraries do. Moment automatically
  // makes you download a bunch of extra stuff... this removes the extras
  // otherwise you'll see 50% of your modules space from moment haha
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

  new webpack.DefinePlugin({
    // if we need to pass env variables to the frontend, this is the place
    // to do it
    'process.env': {
      ROLLBAR_ACCESS_KEY_AA_UI_CLIENT:
         JSON.stringify(process.env.ROLLBAR_ACCESS_KEY_AA_UI_CLIENT),
    },
  }),

  new webpack.ProvidePlugin({
    // make fetch available
    fetch: 'exports-loader?self.fetch!whatwg-fetch',
  }),
    // while building this lets you see the bundling filenames
  new webpack.NamedModulesPlugin(),
];

webpackConfig.module = {
  noParse: /moment\.js/,
  loaders: [
    {
      // Uses .babelrc to configure presets
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      include: path.join(__dirname, '../src'),
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(jpg|png|gif)$/,
      loader: 'file-loader',
    }, {
      test: /\.ico$/,
      loader: 'file-loader?name=[name].[ext]',
    }, {
      // for efficiency/speed use DATA URI for fonts
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
    },
  ],
};

module.exports = webpackConfig;
