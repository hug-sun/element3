import ElTimelineItem from './TimelineItem'

/* istanbul ignore next */
ElTimelineItem.install = function (app) {
  app.component(ElTimelineItem.name, ElTimelineItem)
}

export default ElTimelineItem
