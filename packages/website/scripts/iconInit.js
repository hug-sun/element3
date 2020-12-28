'use strict'

var postcss = require('postcss')
var fs = require('fs')
var path = require('path')
var fontFile = fs.readFileSync(
  require.resolve('element3/lib/theme-chalk/icon.css'),
  'utf8'
)

var nodes = postcss.parse(fontFile).nodes
var classList = []

nodes.forEach((node) => {
  var selector = node.selector || ''
  var reg = new RegExp(/\.el-icon-([^:]+):before/)
  var arr = selector.match(reg)

  if (arr && arr[1]) {
    classList.push(arr[1])
  }
})

classList.reverse()

fs.writeFile(
  path.resolve(__dirname, '../src/icon.json'),
  JSON.stringify(classList, null, 2) + '\n',
  () => {}
)
