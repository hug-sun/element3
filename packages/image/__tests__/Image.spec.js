import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Image from '../Image.vue'
import { IMAGE_FAIL, IMAGE_SUCCESS as src } from './image'

describe('Image.vue', () => {
  describe('Attributes', () => {
    it('src', async () => {
      const Wrapper = mount(Image, {
        props: {
          src
        }
      })
      Wrapper.vm.loading = false
      Wrapper.vm.error = false
      nextTick(() => {
        expect(Wrapper.find('.el-image__inner').attributes('src')).toBe(src)
      })
    })

    it('fit', async () => {
      const image = mount(Image, {
        props: {
          src,
          fit: 'fill'
        }
      })
      image.vm.loading = false
      image.vm.error = false
      nextTick(() => {
        expect(image.find('.el-image__inner').attributes('style')).toContain(
          'object-fit: fill;'
        )
      })
    })

    it('alt', async () => {
      const wrapper = await mount(Image, {
        props: {
          src,
          alt: 'hello world!'
        }
      })
      wrapper.vm.loading = false
      wrapper.vm.error = false
      nextTick(() => {
        expect(wrapper.find('.el-image__inner').attributes('alt')).toBe(
          'hello world!'
        )
      })
    })
    test.todo('referrer-policy')
    test.todo('lazy')
    test.todo('scroll-container')

    it('preview-src-list', async () => {
      const wrapper = await mount(Image, {
        props: {
          previewSrcList: [src, IMAGE_FAIL]
        }
      })
      wrapper.vm.loading = false
      wrapper.vm.error = false
      nextTick(() => {
        wrapper.find('.el-image__preview').trigger('click')
        setTimeout(() => {
          expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
            src
          )
        }, 10)
      })
    })

    it('z-index', async () => {
      const wrapper = await mount(Image, {
        props: {
          previewSrcList: [src, IMAGE_FAIL],
          zIndex: 2020
        }
      })
      wrapper.vm.loading = false
      wrapper.vm.error = false
      nextTick(() => {
        wrapper.find('.el-image__preview').trigger('click')
        setTimeout(() => {
          expect(
            wrapper.find('.el-image-viewer__wrapper').attributes('style')
          ).toContain('z-index: 2020')
        }, 10)
      })
    })
  })

  describe('Events', () => {
    test.todo('load')
    test.todo('error')
  })

  describe('Slots', () => {
    it('placeholder', async () => {
      const wrapper = await mount(Image, {
        props: {
          src
        },
        slots: {
          placeholder: () => {
            return 'loading...'
          }
        }
      })
      wrapper.vm.loading = true
      wrapper.vm.error = false
      nextTick(() => {
        expect(wrapper.find('.el-image').text()).toBe('loading...')
      })
    })

    it('error', async () => {
      const wrapper = mount(Image, {
        props: {
          src: IMAGE_FAIL
        },
        slots: {
          error: () => {
            return 'error'
          }
        }
      })
      wrapper.vm.loading = false
      wrapper.vm.error = true
      nextTick(() => {
        expect(wrapper.find('.el-image').text()).toBe('error')
      })
    })
  })
})
