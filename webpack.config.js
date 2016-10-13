var webpack = require('webpack');
var path = require( 'path' );
var env = process.env.NODE_ENV || 'dev';
var ExtractTextPlugin = require('extract-text-webpack-plugin');

console.log('Node env is : ', env);

/**
 * This is the Webpack configuration file
 * For more information, see: http://webpack.github.io/docs/configuration.html
 */
module.exports = {

  // Efficiently evaluate modules with source maps
  //devtool: "eval",
  //devtool: "source-map",

  // Set entry point to ./src/main and include necessary files for hot load
  entry:  {
    app : './public/js/index.js',
    vendor: [
      'axios',
      'material-ui',
      'moment',
      'lodash',
    ]
  },

  // This will not actually create a bundle.js file in ./build. It is used
  // by the dev server for dynamic hot loading.
  output: {
    path: __dirname + '/public/build/',
    filename: './bundle.[name].js'
  },

  // Necessary plugins
  plugins: [
    new webpack.DefinePlugin({
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
  ],

  // Transform source code using Babel and React Hot Loader
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/, },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.scss$/, loader: 'style!css!sass' },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      { test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/, loaders: ['file-loader'] },
      { test: /\.json$/, loaders: ['json-loader'], include: /\.json$/}
    ]
  },

  // Automatically transform files with these extensions
  resolve: {
    alias:{
      img: path.resolve( __dirname, 'public', 'img' ),
      css: path.resolve( __dirname, 'public', 'css' ),
    },
    extensions: ['', '.js', '.jsx', '.css'],
  },

  // Additional plugins for CSS post processing using postcss-loader
  postcss: [
//    require('autoprefixer'), // Automatically include vendor prefixes
//    require('postcss-nested') // Enable nested rules, like in Sass
  ]

};
