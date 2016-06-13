var webpack = require('webpack');
var path = require('path');
//var css = require('css!./file.css');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var env = process.env.MIX_ENV || 'dev';
var isProduction = (env === 'prod');

var plugins = [
  new ExtractTextPlugin('app.css'),
];

// This is necessary to get the sass @import's working
var stylePathResolves = (
  'includePaths[]=' + path.resolve('./') + '&' +
    'includePaths[]=' + path.resolve('./node_modules')
);

if (isProduction) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
}

module.exports = {
  entry: './public/js/index.js',

  output: {
    path: require("path").resolve('./public'),
    filename: 'app.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
    ]
  },

  plugins: plugins
};
