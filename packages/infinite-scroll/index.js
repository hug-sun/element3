import InfiniteScroll from './InfiniteScroll'

/* istanbul ignore next */
InfiniteScroll.install = function (app) {
  app.directive(InfiniteScroll.name, InfiniteScroll)
}
export default InfiniteScroll