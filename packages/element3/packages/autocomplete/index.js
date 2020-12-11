import ElAutocomplete from './src/autocomplete'

/* istanbul ignore next */
ElAutocomplete.install = function (app) {
  app.component(ElAutocomplete.name, ElAutocomplete)
}

export default ElAutocomplete
