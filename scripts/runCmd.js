const { exec } = require('child_process')
const { argv, cwd } = require('process')

const multiCmd = argv.slice(2)
console.log('cwd: ', cwd())
console.log('run: ', multiCmd)
multiCmd.forEach((cmd) => {
  const sub = exec(cmd, {
    cwd: cwd(),
  })
  sub.stderr.on('data', (data) => {
    console.error(`[${cmd}]\n`, data)
  })
  sub.stdout.on('data', (data) => {
    console.info(`[${cmd}]\n`, data)
  })
})

process.on('beforeExit', () => {
  console.log('runCmd exit!')
  process.exitCode = 0
})
