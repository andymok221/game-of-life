const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    app: [
      './src/client/js/app.js'
    ]
  },
  externals: {
    Primus: true
  },
  output: {
    path: path.resolve(__dirname, './src/client/public/js'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: ['/node_modules/'], loader: 'babel-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false
    })
  ]
};
