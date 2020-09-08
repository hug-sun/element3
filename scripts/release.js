// todo
// 1. 自动把要发版的组件添加到 entry.js 文件内
// 2. 编译 css
// 3. 生成 changelog
// 4. 提交前自动 git add . 所有文件

const execa = require('execa')
const chalk = require('chalk')
const args = require('minimist')(process.argv.slice(2))
const { prompt } = require('enquirer')

const step = (msg) => console.log(chalk.cyan(msg))

async function main() {
  const targetVersion = args.v

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`
  })

  if (!yes) return

  step('\nBuilding...')
  await execa('npm', ['run', 'build:next'])

  step('\nUpdate version...')
  await execa('npm', [
    'version',
    targetVersion,
    '--message',
    `build: release v${targetVersion}`
  ])

  step('\nPublishing package...')
  await execa('npm', ['publish', '--registry', 'https://registry.npmjs.org'])

  step('\nPushing to GitHub...')
  await execa('git', ['push', 'origin', `v${targetVersion}`])

  console.log()
  console.log(chalk.green(`Successfully published v${targetVersion}`))
}

main().catch((err) => {
  console.error(err)
})
