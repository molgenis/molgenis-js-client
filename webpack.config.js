const path = require('path')
module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: './molgenis-api-client.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    libraryTarget: 'umd',
    library: 'molgenis-api-client'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }]
    }
    ]
  }
}
