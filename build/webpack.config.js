const path = require('path');
const webpack = require('webpack');
const WebpackShellPlugin = require('webpack-shell-plugin')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),

  output: {
    filename: 'film.min.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'Film',
    libraryTarget: 'umd'
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new WebpackShellPlugin({
      onBuildEnd: ['cp dist/film.min.js docs/film.min.js']
    })
  ]
};
