// webpack v4
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Webpack = require('webpack');

const webAppPath = './src/app';
const appEntry = '/index.js';
const htmlTemplatePath = './index.html';

module.exports = {
  entry: {
    main: ['babel-polyfill', webAppPath + appEntry],
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  node: {
    fs: 'empty',
  },
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: 'dist',
    compress: true,
    port: process.env.port,
    stats: 'errors-only',
    open: true,
    inline: true,
    historyApiFallback: true,
    proxy: {
      //   "/api": "http://localhost/haulplan-old/",
      //   "/token": "http://localhost/haulplan-old/",
      //   "/signalr": "http://localhost/haulplan-old/signalr",
      //  "/haulplan-old/signalr":"http://localhost/haulplan-old/signalr", //to forward signalr connection.
      //  "/MultiFileUpload" : "http://localhost/haulplan-old/",
      //  "/Home": "http://localhost/haulplan-old/",     
    },
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    },
    {
      test: /\.json$/,
      use: 'json-loader',
    },
    {
      test: /\.s?css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader'],
        allChunks: true,
      }),
    },
    {
      test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'fonts/[name].[ext]?[hash]',
        },
      }],
    },
    {
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]',
        },
      }],
    },

    ],
  },
  plugins: [
    new Webpack.DefinePlugin({
      BASE_URL: JSON.stringify('http://localhost:1224/'),
    }),
    new ExtractTextPlugin({
      filename: 'style.[chunkhash].css',
      disable: false,
      allChunks: true,
    }),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname),
      verbose: true,
      dry: false,
      exclude: ['node_modules'],
    }),
    new HtmlWebpackPlugin({
      template: htmlTemplatePath,
      favicon: `${__dirname}/src/assets/images/favicon.ico`,
    }),
    new CopyWebpackPlugin([{
      from: `${__dirname}/src/assets/images`,
      to: `${__dirname}/dist/assets/images/`,
    },
    {
      from: `${__dirname}/src/assets/path`,
      to: `${__dirname}/dist/assets/path/`,
    },
    {
      from: `${__dirname}/src/assets/images/favicon.ico`,
      to: `${__dirname}/dist/assets/images/favicon.ico`,
    },
    ]),
    new Webpack.ProvidePlugin({
      ReactDOM: 'react-dom',
      React: 'react',
    }),
  ],
};
