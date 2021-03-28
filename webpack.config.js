const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = {
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
}

module.exports = [
  {
    target: 'webworker',
    entry: {
      background: './src/background.js'
    },
    resolve: {
      fallback: {
        url: require.resolve('url/'),
        timers: require.resolve('timers-browserify'),
        stream: require.resolve('stream-browserify'),
        https: require.resolve('https-browserify'),
        http: require.resolve('stream-http'),
        path: require.resolve('path-browserify'),
        util: require.resolve('util/')
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      }),
      new CopyPlugin({
        patterns: [
          'manifest.json'
        ]
      })
    ],
    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    ...common
  },
  {
    target: 'web',
    entry: {
      popup: './src/popup.js'
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'popup.html',
        template: './src/popup.ejs',
        title: 'Youtube Music DL - Popup',
        chunks: ['popup']
      })
    ],
    ...common
  },
  {
    target: 'web',
    entry: {
      content: './src/content.js'
    },
    ...common
  }
]
