const webpack = require('webpack');
const path = require('path');

module.exports = () => {
  return {
    entry: './src/index.js',
    devtool: 'sourcemaps',
    cache: true,
    mode: 'development',
    output: {
      path: path.resolve(__dirname, '../backend/src/main/resources/static/built'),
      filename: 'bundle.js',
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
          test: /\.(ttf|eot|svg|otf|woff(2)?)(\S+)?$/,
          use: 'file-loader'
        }
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env' : {
          'REACT_APP_API_BASE_URL' : JSON.stringify('http://localhost:8080')
        }
      })
    ]
  }
};
