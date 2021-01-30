/*eslint no-import-assign: "off"*/
import {
  useGlobalOptions,
  setupGlobalOptions
} from '../../../src/composables/globalConfig'
import * as Vue from 'vue'

describe('globalConfig', () => {
  describe('useGlobalOptions', () => {
    test('should given warn when instance eq to null', () => {
      console.warn = jest.fn((v) => v)
      Vue.getCurrentInstance = jest.fn(null)

      useGlobalOptions()

      expect(console.warn).toHaveBeenCalledWith(
        'useGlobalOptions must be call in setup function'
      )
    })

    test('should get $ELEMENT ', () => {
      const $ELEMENT = {
        size: 'small'
      }

      Vue.getCurrentInstance = () => ({
        appContext: {
          config: {
            globalProperties: {
              $ELEMENT
            }
          }
        }
      })

      const result = useGlobalOptions()
      expect(result).toEqual($ELEMENT)
    })
  })

  describe('setupGlobalOptions', () => {
    const createApp = () => {
      return {
        config: {
          globalProperties: {
            $ELEMENT: {}
          }
        }
      }
    }
    test('default options ', () => {
      const app = createApp()
      setupGlobalOptions()(app)

      expect(app.config.globalProperties.$ELEMENT).toEqual({
        size: '',
        zIndex: 2000
      })
    })

    test('set value', () => {
      const app = createApp()
      const opts = {
        size: 'small',
        zIndex: 1000
      }

      setupGlobalOptions(opts)(app)

      expect(app.config.globalProperties.$ELEMENT).toEqual(opts)
    })
  })
})
