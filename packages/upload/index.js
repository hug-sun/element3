import Upload from './src'

/* istanbul ignore next */
Upload.install = function (app) {
  app.component(Upload.name, Upload)
}

export default Upload
