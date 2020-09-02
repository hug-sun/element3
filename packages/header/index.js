import Header from './Header'

/* istanbul ignore next */
Header.install = function (app) {
  app.component(Header.name, Header)
}

export default Header
