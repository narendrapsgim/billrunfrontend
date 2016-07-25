var webpack = require('webpack');
var path = require('path');
//var css = require('css!./file.css');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var env = process.env.MIX_ENV || 'dev';
var isProduction = (env === 'prod');

var plugins = [
  new ExtractTextPlugin('app.css'),
  new webpack.optimize.OccurenceOrderPlugin(),
  new HtmlWebpackPlugin({
    hash: true,
    template: 'index.tmpl.html',
    inject: true
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    output: {
      comments: false
    },
    compress: {
      drop_console: true,
      warnings: false
    }
  })
];

// This is necessary to get the sass @import's working
var stylePathResolves = (
  'includePaths[]=' + path.resolve('./') + '&' +
    'includePaths[]=' + path.resolve('./node_modules')
);

// if (isProduction) {
//   plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
// }

module.exports = {
  entry: './public/js/index.js',

  output: {
    path: require("path").resolve('./public'),
    filename: 'app.js'
  },

  module: {
    noParse: /node_modules\/quill\/dist/,
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {include: /\.json$/, loaders: ["json-loader"]}
    ]
  },

  plugins: plugins
};
