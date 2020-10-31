import ElInfiniteScroll from './src/main.js'

/* istanbul ignore next */
ElInfiniteScroll.install = function (app) {
  app.directive(ElInfiniteScroll.name, ElInfiniteScroll)
}

export default ElInfiniteScroll
