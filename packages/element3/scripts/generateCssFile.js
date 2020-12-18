const fs = require('fs')
const path = require('path')
const blacklist = ['icon', 'option', 'option-group', 'theme-chalk']
const componentPath = path.resolve(__dirname, '../packages')
const themePath = path.resolve(componentPath, 'theme-chalk/src')
const fileSuffix = '.scss'
const indexFileName = 'index' + fileSuffix
const outputIndexFilePath = path.resolve(themePath, indexFileName)

;(function main() {
  save(genCssCode())
})()

function genCssCode() {
  var indexContent = '@import "./base.scss";\n'
  return getComponentNameList().reduce((context, filePath) => {
    return (context += '@import "./' + filePath + '";\n')
  }, indexContent)
}

function getComponentNameList() {
  return fs
    .readdirSync(componentPath)
    .filter((name) => {
      return !blacklist.includes(name)
    })
    .map((componentName) => {
      return componentName + fileSuffix
    })
}

function save(cssCode) {
  fs.writeFileSync(outputIndexFilePath, cssCode)
}
