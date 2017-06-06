const path = require('path')
module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: './molgenis-api-client.js',
  output: {
    path: __dirname,
    filename: '[name].js'
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
