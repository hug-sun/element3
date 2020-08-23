import Timeline from './src/main'

/* istanbul ignore next */
Timeline.install = function (app) {
  app.component(Timeline.name, Timeline)
}

export default Timeline
