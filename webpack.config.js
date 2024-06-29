import path from 'path'
import webpack from 'webpack'
import CopyPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import generate from 'generate-file-webpack-plugin'
import { fileURLToPath } from 'url'
import buildContentScript from './build-content-script.cjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const common = {
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    hashFunction: 'xxhash64'
  }
}

const contentScript = buildContentScript()

const config = [
  {
    target: 'webworker',
    entry: {
      background: './src/background.js'
    },
    resolve: {
      fallback: {
        http: path.join(__dirname, 'node_modules/stream-http/index.js'),
        https: path.join(__dirname, 'node_modules/https-browserify/index.js'),
        path: path.join(__dirname, 'node_modules/path-browserify/index.js'),
        stream: path.join(__dirname, 'node_modules/stream-browserify/index.js'),
        timers: path.join(__dirname, 'node_modules/timers-browserify/main.js'),
        querystring: path.join(__dirname, 'node_modules/querystring-es3/index.js'),
        url: path.join(__dirname, 'node_modules/url/url.js'),
        util: path.join(__dirname, 'node_modules/util/util.js'),
        vm: path.join(__dirname, 'node_modules/vm-browserify/index.js')
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      }),
      new CopyPlugin({
        patterns: [
          'manifest.json',
          'src/imgs/icon128.png'
        ]
      }),
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        const mod = resource.request.replace(/^node:/, '')

        switch (mod) {
          case 'path':
            resource.request = 'path-browserify'
            break
          default:
            throw new Error(`Not found ${mod}`)
        }
      })
    ],
    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    ...common
  },
  {
    target: ['browserslist:modern', 'es5'],
    entry: {
      popup: './src/popup.js'
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'popup.html',
        template: './src/popup.ejs',
        title: 'YouTube Music DL - Popup',
        chunks: ['popup']
      })
    ],
    ...common
  },
  {
    target: ['browserslist:modern', 'es5'],
    entry: {
      content: './src/content.js'
    },
    plugins: [
      generate({
        file: 'content-script.js',
        content: contentScript.content
      })
    ],
    ...common
  }
]

export default config
