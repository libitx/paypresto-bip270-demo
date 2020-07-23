const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = (env, options) => {
  const devMode = options.mode !== 'production'

  const config = {
    entry: {
      main: './src/index.js'
    },

    output: {
      path: path.resolve(__dirname, 'docs'),
      filename: '[name].js',
      libraryTarget: 'umd'
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },

    resolve: {
      modules: ['src', 'node_modules']
    },

    optimization: {
      minimizer: [
        new TerserPlugin({ cache: true, parallel: true,  sourceMap: devMode}),
        new OptimizeCssAssetsPlugin({})
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new VueLoaderPlugin()
    ]
  }

  if (devMode) {
    config.devtool = 'source-map'
    config.devServer = {
      hot: true,
      historyApiFallback: true
    }
  }

  return config
}