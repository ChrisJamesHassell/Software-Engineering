var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
var WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');



module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        exclude: '/.module.css$/'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        ],
        include: '/.module.css$/'
      },
      {
        test: /\.svg$/,
        use: 'file-loader'
      },
      {
        test: /.*\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
              name: 'images/[hash]-[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx', '.css' ]
  },
  plugins: [
    new WebpackPwaManifest({
      filename: 'manifest.json',
      name: 'Platypus',
      short_name: 'Platy',
      description: 'Modern web app for organizing your life.',
      background_color: '#3F5261',
      theme_color: '#47B5AB',
      publicPath: '/',
      inject: true,
      fingerprints: false,
      ios: {
        'apple-mobile-web-app-title': 'Platypus',
        'apple-mobile-web-app-status-bar-style': '#3F5261'
      },
      icons: [
        {
          src: path.resolve('src/images/icons/icon-72x72.png'),
          size: '72x72',
          ios: true
        },
        {
          src: path.resolve('src/images/icons/icon-96x96.png'),
          size: '96x96',
          ios: true
        },
        {
          src: path.resolve('src/images/icons/icon-128x128.png'),
          size: '128x128',
          ios: true
        },
        {
          src: path.resolve('src/images/icons/icon-192x192.png'),
          size: '192x192',
          ios: true
        },
        {
          src: path.resolve('src/images/icons/icon-384x384.png'),
          size: '384x384',
          ios: true
        },
        {
          src: path.resolve('src/images/icons/icon-512x512.png'),
          size: '512x512',
          ios: true
        }
      ]
    }),
    new CompressionPlugin({
      test: /\.(js|css)$/,
      filename: '[path].gz[query]',
      algorithm: 'gzip'
    })
  ],
  devServer: {
    contentBase: './dist',
    compress: true,
    hot: true
  },
}