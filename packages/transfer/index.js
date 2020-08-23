import Transfer from './src/main'

/* istanbul ignore next */
Transfer.install = function (app) {
  app.component(Transfer.name, Transfer)
}

export default Transfer
