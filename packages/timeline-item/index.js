import ElTimelineItem from '../timeline/src/item'

/* istanbul ignore next */
ElTimelineItem.install = function (app) {
  app.component(ElTimelineItem.name, ElTimelineItem)
}

export default ElTimelineItem
