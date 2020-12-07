// run: yarn release -v [version]
// test: yarn release -v [version] --dry
const execa = require('execa')
const chalk = require('chalk')
const args = require('minimist')(process.argv.slice(2))
const { prompt } = require('enquirer')
const isDryRun = args.dry

const step = (msg) => console.log(chalk.cyan(msg))
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })
const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts)
const runIfNotDry = isDryRun ? dryRun : run

async function main() {
  const targetVersion = args.v

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`
  })

  if (!yes) return

  step('\nRunning tests...')
  await run('npm', ['run', 'test'])

  step('\nBuilding...')
  await run('npm', ['run', 'build:next'])

  step('\nUpdate version...')
  await run('npm', ['version', targetVersion, '--no-git-tag-version'])

  // generate changelog
  await run(`yarn`, ['changelog'])

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await runIfNotDry('git', ['add', '-A'])
    await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`])
  } else {
    console.log('No changes to commit.')
  }

  step('\nPublishing package...')
  await runIfNotDry('npm', [
    'publish',
    '--registry',
    'https://registry.npmjs.org'
  ])

  step('\nPushing to GitHub...')
  await runIfNotDry('git', ['tag', `v${targetVersion}`])
  await runIfNotDry('git', [
    'push',
    'origin',
    `refs/tags/v${targetVersion}`,
    '--no-verify'
  ])
  await runIfNotDry('git', ['push', 'origin', 'master', '--no-verify'])

  console.log()
  console.log(chalk.green(`Successfully published v${targetVersion}`))
}

main().catch((err) => {
  console.error(err)
})
