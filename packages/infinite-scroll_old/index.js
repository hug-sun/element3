import InfiniteScroll from './src/main.js'

/* istanbul ignore next */
InfiniteScroll.install = function (app) {
  app.directive(InfiniteScroll.name, InfiniteScroll)
}

export default InfiniteScroll
