const path = require('path');

module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'film.min.js',
    path: path.join(__dirname, 'dist'),
    library: 'Film',
    libraryTarget: 'umd'
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};
