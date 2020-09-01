import { mount as $mount } from '@vue/test-utils'
import Image from '../Image.vue'
import { IMAGE_SUCCESS as src } from './image'

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
      // TODO
    })

    it('z-index', async () => {
      // TODO
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
      // TODO
    })
  })
})
