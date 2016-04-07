const express = require('express');
const webpack = require('webpack');

const server = express();
server.use(express.static(__dirname + '/public'));

const config = require('./webpack.config.js');
const compiler = webpack(config);
const webpackMiddleware = require("webpack-dev-middleware");
server.use(webpackMiddleware(compiler));
server.use(require('webpack-hot-middleware')(compiler));

server.get('/', function (req, res) {
  res.sendfile('index.html');
});

const port = 3000;
server.listen(port);
