import Image from '../Image.vue'
import { mount as _mount } from '@vue/test-utils'

const mount = async (Component, options) => {
  const wrapper = _mount(Component, options)
  wrapper.componentVM.$isServer = false
  wrapper.componentVM.loading = false
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(wrapper)
    }, 0)
  })
}

Image.$isServer = false

describe('Image.vue', () => {
  describe('Attributes', () => {
    it('src', async () => {
      const wrapper = await mount(Image, {
        props: {
          src: 'test.jpg'
        }
      })
      expect(wrapper.find('.el-image__inner').attributes('src')).toBe(
        'test.jpg'
      )
    })

    it('fit', async () => {
      const wrapper = await mount(Image, {
        props: {
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
    // Slots

    it('placeholder', async () => {
      // TODO
    })

    it('error', async () => {
      // TODO
    })
  })
})
