var path = require('path')
var nodeExternals = require('webpack-node-externals')

const externals = [nodeExternals()]

exports.externals = externals

exports.alias = {
  main: path.resolve(__dirname, '../src')
}

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue'
}

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/
