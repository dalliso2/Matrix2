const webpack = require('webpack');
const path = require('path');

const config = {
  mode: 'production',
  entry: [
    'react-hot-loader/patch',
    './src/index.js'
  ],
/*  output: { 
    //path: path.join(__dirname, "public"),
    //path: '../src/main/resources/static',
    path: path.resolve(__dirname, "../src/main/resources/static"),
    filename: "bundle.js",
    },*/
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
        ]
      }
    ]
  },
  
  devServer: {
    'static': { directory: './dist' },
    proxy: [ { context: ['/api','/logout'], target: 'http://localhost:8080/' } ],
    port: 8081,
    historyApiFallback: true,
  }
};


module.exports = config;