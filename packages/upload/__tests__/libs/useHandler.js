import { mount } from '@vue/test-utils'
import { merge } from 'lodash'

const useMount = (element, defaultOptions) => {
  return (props = {}) => mount(element, merge({}, defaultOptions, props))
}

const testFileGet = (element, files) => {
  Object.defineProperty(element, 'files', {
    get() {
      return files
    }
  })
}

export { useMount, testFileGet }
