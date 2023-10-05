import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  entry: './src/main.ts',
  output: {
    filename: 'bundle.[contenthash].js',
    path: resolve(__dirname, 'build'),
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',

  plugins: [

    new CopyPlugin({
      patterns: [{
      from: 'public',
      globOptions: {
        ignore: ['**/index.html'],
      },
      }],
  }),

  new HtmlWebpackPlugin({
    template: './public/index.html'
    })
],
  module: {
    rules: [
    {
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
      exclude: /(node_modules)/,
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /(node_modules)/,
        }
    ],
  },
}
