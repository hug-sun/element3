const glob = require('glob')
const fs = require('fs')
const path = require('path')
// eslint-disable-next-line no-path-concat
const scanPath = path.resolve(__dirname, '../packages/')
const list = glob.sync(path.resolve(__dirname, '../packages/**/*.vue'))
list.forEach((path) => {
  const source = fs.readFileSync(path).toString()
  const lines = source.split('\n')
  const log = []
  lines.forEach((line) => {
    log.push(printInject(line))
    log.push(printComponent(line))
  })
  const str = log.join('')
  if (str.length !== 0) {
    console.log('==================================')
    console.log(path.replace(scanPath, ''))
    console.log(str)
  }
})

function printInject(line) {
  if (/inject: \[/.exec(line)) {
    return `Inject\t${line}\n`
  }
  return ''
}

function printComponent(line) {
  if (/from 'element-ui\/packages/.exec(line)) {
    return `Component\t${line}\n`
  }
  return ''
}
