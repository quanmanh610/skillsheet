const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = () => {
  return {
    entry: './src/index.js',
    devtool: 'sourcemaps',
    cache: true,
    // mode: 'development',
    mode: 'production',
    output: {
      path: path.resolve(
        __dirname,
        '../backend/src/main/resources/static/built'
      ),
      filename: 'bundle.js',
    },
    optimization: {
      minimizer: [new UglifyJsPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(ttf|png|eot|svg|otf|woff(2)?)(\S+)?$/,
          use: 'file-loader',
        },
      ],
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
      }),
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {
      //     screw_ie8: true,
      //     warnings: false
      //   },
      //   mangle: {
      //     screw_ie8: true
      //   },
      //   output: {
      //     comments: false,
      //     screw_ie8: true
      //   }
      // }),
      new webpack.DefinePlugin({
        'process.env': {
          REACT_APP_API_BASE_URL: JSON.stringify(''),
          // 'NODE_ENV': JSON.stringify('production')
        },
      }),
    ],
  };
};
