import { mount } from '@vue/test-utils'
import Image from '../Image.vue'
import { IMAGE_FAIL, IMAGE_SUCCESS as src } from './image'

Image.$isServer = false

describe('Image.vue', () => {
  describe('Attributes', () => {
    it('src', async () => {
      const wrapper = await mount(Image, {
        props: {
          src
        }
      })
      setTimeout(() => {
        expect(wrapper.find('.el-image__inner').attributes('src')).toBe(src)
      }, 100)
    })

    it('fit', async () => {
      const wrapper = await mount(Image, {
        props: {
          src,
          fit: 'fill',
          load() {
            expect(
              wrapper.find('.el-image__inner').attributes('style')
            ).toContain('object-fit: fill;')
          }
        }
      })
    })

    it('alt', async () => {
      const wrapper = await mount(Image, {
        props: {
          src,
          alt: 'hello world!',
          load() {
            expect(wrapper.find('.el-image__inner').attributes('alt')).toBe(
              'hello world!2'
            )
          }
        }
      })
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
      const wrapper = await mount(Image, {
        props: {
          src,
          load() {
            expect(wrapper.find('.el-image__inner').attributes('src')).toBe(
              'test.jpg'
            )
          }
        }
      })
    })
    it('error', async () => {
      const wrapper = await mount(Image, {
        src: IMAGE_FAIL,
        slots: {
          error: () => {
            return 'bad image'
          }
        },
        error() {
          expect(wrapper.find('.el-image').text()).toBe('bad image')
        }
      })
    })
  })

  describe('Slots', () => {
    it('placeholder', async () => {
      const wrapper = await mount(Image, {
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
      const wrapper = await mount(Image, {
        src: IMAGE_FAIL,
        slots: {
          error: () => {
            return 'bad image'
          }
        },
        load() {
          expect(wrapper.find('.el-image').text()).toBe('bad image')
        }
      })
    })
  })
})
