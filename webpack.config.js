const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const isProd = Boolean(process.env.NODE_ENV);

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public')
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false
      })
    ]
  },
  devtool: isProd ? false : 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    watchContentBase: true
  }
};
