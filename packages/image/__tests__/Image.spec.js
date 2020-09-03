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
  return wrapper
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
    test.todo('referrer-policy')
    test.todo('lazy')
    test.todo('scroll-container')

    it('preview-src-list', async () => {
      const wrapper = await mount(Image, {
        props: {
          previewSrcList: [src, IMAGE_FAIL]
        },
        data() {
          return {
            showViewer: true
          }
        }
      })
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(src)
    })

    it('z-index', async () => {
      const wrapper = await mount(Image, {
        props: {
          previewSrcList: [src, IMAGE_FAIL],
          zIndex: 2020
        },
        data() {
          return {
            showViewer: true
          }
        }
      })
      expect(
        wrapper.find('.el-image-viewer__wrapper').attributes('style')
      ).toContain('z-index: 2020')
    })
  })

  describe('Events', () => {
    test.todo('load')
    test.todo('error')
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
        src: IMAGE_FAIL,
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
