var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')

var webpackConfig = merge(baseConfig, {
  devtool: '#inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/test.env')
    })
  ]
})

delete webpackConfig.entry

module.exports = webpackConfig
