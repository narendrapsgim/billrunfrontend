var webpack = require('webpack');
var path = require( 'path' );
var chalk = require( 'chalk' );
var copyWebpackPlugin = require('copy-webpack-plugin');
var env = process.env.NODE_ENV || 'dev';
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var isProd = (env === 'production');

if(isProd) {
  console.log(chalk.bgYellow('Node env is : ', env));
} else {
  console.log(chalk.bgGreen('Node env is : ', env));
}


/**
 * This is the Webpack configuration file
 * For more information, see: http://webpack.github.io/docs/configuration.html
 */
module.exports = {

  // Efficiently evaluate modules with source maps
  // devtool: "eval",
  // devtool: "source-map",

  // Set entry point to ./src/main and include necessary files for hot load
  entry: {
    app: './public/js/index.js',
    vendor: [
      'material-ui',
      'immutable',
      'moment',
      'moment-timezone',
      'lodash',
      'react-select',
      'react-datepicker',
      'uuid',
      'change-case',
      'file-size',
      'classnames',


    ],
  },

  // This will not actually create a bundle.js file in ./build. It is used
  // by the dev server for dynamic hot loading.
  output: {
    path: __dirname + (isProd ? '/dist/' : '/public/build/'),
    filename: 'bundle.[name].js'
  },

  // Necessary plugins
  plugins: [
    new webpack.DefinePlugin({
      '_PRODUCTION_': JSON.stringify(isProd),
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    new ExtractTextPlugin('bundle.css'),
    new HtmlWebpackPlugin({
      filename: isProd ? "../dist/index.html" : "../index.html",
      hash: true,
      template: 'index.tmpl.html',
      inject: true
    }),
    new copyWebpackPlugin([
      {
        from: 'vendors',
        to: isProd ? 'vendors' : "../vendors"
      }, {
        from: isProd ? 'config/globalSettings.prod.js' : 'config/globalSettings.dev.js',
        to: isProd ? 'globalSettings.js' : "../globalSettings.js"
      },
    ])
  ],

  // Transform source code using Babel and React Hot Loader
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader?sourceMap', 'css-loader?sourceMap') },
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.scss$/, loader: 'style!css!sass' },
      { test: /\.(png|jpg|jpe|woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'url-loader?limit=100000' },
      { test: /\.json$/, loader: 'json-loader', include: /\.json$/ },
      { test: /\.html$/, loader: 'html-loader' },
    ]
  },

  // Automatically transform files with these extensions
  resolve: {
    alias: {
      img: path.resolve(__dirname, 'public', 'img'),
      css: path.resolve(__dirname, 'public', 'css'),
    },
    extensions: ['', '.js', '.jsx', '.css'],
  },

  // Additional plugins for CSS post processing using postcss-loader
  postcss: [
//    require('autoprefixer'), // Automatically include vendor prefixes
//    require('postcss-nested') // Enable nested rules, like in Sass
  ]

};
