/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const blacklist = ['icon', 'option', 'option-group', 'theme-chalk']
const componentPaths = [
  path.resolve(__dirname, '../packages'),
  path.resolve(__dirname, '../src/components')
]
const themePath = path.resolve(__dirname, '../packages', 'theme-chalk/src')
const fileSuffix = '.scss'
const indexFileName = 'index' + fileSuffix
const outputIndexFilePath = path.resolve(themePath, indexFileName)

;(function main() {
  save(genCssCode(getAllComponentName()))
})()

function getAllComponentName() {
  return componentPaths
    .map((componentPath) => {
      return getComponentNameList(componentPath)
    })
    .reduce((total, components) => {
      return [...total, ...components]
    })
}

function getComponentNameList(componentPath) {
  return fs
    .readdirSync(componentPath)
    .filter((name) => {
      // 临时处理 忽略 src/component 内的组件
      if (componentPath.includes('src/component')) {
        if (name === 'Table' || name === 'TableColumn') {
          return false
        }
      }
      return !blacklist.includes(name)
    })
    .filter((name) => {
      return !name.startsWith('.')
    })
    .map((componentName) => {
      return (
        componentName.charAt(0).toLocaleLowerCase() +
        componentName.slice(1) +
        fileSuffix
      )
    })
}

function genCssCode(componentNameList) {
  var indexContent = '@import "./base.scss";\n'

  return componentNameList.reduce((context, filePath) => {
    return (context += '@import "./' + filePath + '";\n')
  }, indexContent)
}

function save(cssCode) {
  fs.writeFileSync(outputIndexFilePath, cssCode)
}
