import { mount as $mount } from '@vue/test-utils'
import Image from '../Image.vue'
import { IMAGE_FAIL, IMAGE_SUCCESS as src } from './image'

const mount = async (Component, _options) => {
  const options = _options || {}
  options.data =
    options.data ||
    function () {
      return {
        loading: false
      }
    }
  const wrapper = await $mount(Component, options)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(wrapper)
    }, 1)
  })
}

describe('Image.vue', () => {
  describe('Attributes', () => {
    it('src', async () => {
      const wrapper = await mount(Image, {
        props: {
          src
        }
      })
      expect(wrapper.find('.el-image__inner').attributes('src')).toBe(src)
    })

    it('fit', async () => {
      const wrapper = await mount(Image, {
        props: {
          src,
          fit: 'fill'
        }
      })
      expect(wrapper.find('.el-image__inner').attributes('style')).toContain(
        'object-fit: fill;'
      )
    })

    it('alt', async () => {
      const wrapper = await mount(Image, {
        props: {
          src,
          alt: 'hello world!'
        }
      })
      expect(wrapper.find('.el-image__inner').attributes('alt')).toBe(
        'hello world!'
      )
    })

    it('referrer-policy', async () => {
      // TODO
    })

    it('lazy', async () => {
      // TODO
    })

    it('scroll-container', async () => {
      // TODO
    })

    it('preview-src-list', async () => {
      const wrapper = await mount(Image, {
        props: {
          src: IMAGE_FAIL,
          previewSrcList: [src, IMAGE_FAIL]
        }
      })

      await wrapper.trigger('click')

      console.log('TODO previewSrcList')
    })

    it('z-index', async () => {
      const wrapper = await mount(Image, {
        props: {
          src,
          previewSrcList: [src, IMAGE_FAIL],
          zIndex: 2020
        }
      })
      await wrapper.find('.el-image__inner').trigger('click')
      console.log('TODO zIndex')
    })
  })
  describe('Events', () => {
    it('load', async () => {
      // TODO
    })
    it('error', async () => {
      // TODO
    })
  })

  describe('Slots', () => {
    it('placeholder', async () => {
      const wrapper = await $mount(Image, {
        src,
        slots: {
          placeholder: () => {
            return 'loading...'
          }
        }
      })
      expect(wrapper.find('.el-image').text()).toBe('loading...')
    })

    it('error', async () => {
      const wrapper = await $mount(Image, {
        src,
        slots: {
          error: () => {
            return 'error!'
          }
        },
        data() {
          return {
            loading: false,
            error: true
          }
        }
      })
      expect(wrapper.find('.el-image').text()).toBe('error!')
    })
  })
})
