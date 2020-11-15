import ElTimeline from './Timeline'

/* istanbul ignore next */
ElTimeline.install = function (app) {
  app.component(ElTimeline.name, ElTimeline)
}

export default ElTimeline
