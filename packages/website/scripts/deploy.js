const execa = require('execa')
const path = require('path')
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })
const distPath = path.resolve(__dirname, '../dist')
const deployToken = process.env.DEPLOY_TOKEN
;(async function main() {
  // login
  await run('tcb', ['login'])

  //   Running clean
  await run('tcb', ['hosting', 'delete', '-d', '-e', deployToken])

  //   //   Running deploy
  await run('tcb', ['hosting', 'deploy', distPath, '-e', deployToken])
})()
