import { mount as $mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Image from '../Image.vue'
import { IMAGE_FAIL, IMAGE_SUCCESS as src } from './image'

const mount = async (Component, _options) => {
  const options = _options || {}
  options.data =
    options.data ||
    function () {
      return {
        loading: true
      }
    }
  const wrapper = await $mount(Component, options)
  return wrapper
}

describe('Image.vue', () => {
  describe('Attributes', () => {
    it('should render props.src', async () => {
      const wrapper = await mount(Image, {
        props: {
          src
        }
      })
      wrapper.componentVM.loading = false
      await nextTick()
      expect(wrapper.find('.el-image__inner').attributes('src')).toBe(src)
    })

    it('should render props.fit', async () => {
      const wrapper = await mount(Image, {
        props: {
          src,
          fit: 'fill'
        }
      })
      wrapper.componentVM.loading = false
      await nextTick()
      expect(wrapper.find('.el-image__inner').attributes('style')).toContain(
        'object-fit: fill;'
      )
    })

    it('should render props.alt', async () => {
      const wrapper = await mount(Image, {
        props: {
          src,
          alt: 'hello world!'
        }
      })
      wrapper.componentVM.loading = false
      await nextTick()
      expect(wrapper.find('.el-image__inner').attributes('alt')).toBe(
        'hello world!'
      )
    })

    it('should render props.referrer-policy', async () => {
      const wrapper = await mount(Image, {
        props: {
          'referrer-policy': 'test-referrerPolicy'
        }
      })
      wrapper.componentVM.loading = false

      await nextTick()

      expect(
        wrapper.find('.el-image__inner').attributes('referrer-policy')
      ).toEqual('test-referrerPolicy')
    })

    it('should render props.lazy', async () => {
      const wrapper = await mount(Image, {
        propsData: {
          lazy: true
        }
      })

      await nextTick()
      expect(wrapper.find('.el-image__inner').exists()).toBe(false)

      wrapper.setProps({ lazy: false })
      await nextTick()
      expect(wrapper.find('.el-image__inner').exists()).toBe(true)
    })

    it('should render props.preview-src-list frist item', async () => {
      const wrapper = await mount(Image, {
        props: {
          previewSrcList: [src, IMAGE_FAIL]
        }
      })
      wrapper.componentVM.showViewer = true
      await nextTick()
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(src)
    })

    it('should render props.z-index', async () => {
      const wrapper = await mount(Image, {
        props: {
          previewSrcList: [src, IMAGE_FAIL],
          zIndex: 2020
        }
      })
      wrapper.componentVM.showViewer = true
      await nextTick()
      expect(
        wrapper.find('.el-image-viewer__wrapper').attributes('style')
      ).toContain('z-index: 2020')
    })

    it('src update should be call loadimage method', async () => {
      const wrapper = await mount(Image, {
        propsData: {
          src,
          lazy: false
        }
      })

      wrapper.componentVM.loading = false
      wrapper.setProps({ src: IMAGE_FAIL })
      await nextTick()
      expect(wrapper.find('.el-image__inner').attributes('src')).toBe(
        IMAGE_FAIL
      )
    })
  })

  describe('click image', () => {
    it('click image should be show preview div', async () => {
      const wrapper = await mount(Image, {
        propsData: {
          src,
          lazy: false,
          previewSrcList: [src, IMAGE_FAIL]
        },
        shallow: true
      })

      wrapper.componentVM.loading = false

      expect(wrapper.find('el-image-viewer-stub').exists()).toBe(false)
      await nextTick()

      wrapper.find('.el-image__inner').trigger('click')

      await nextTick()
      expect(wrapper.find('el-image-viewer-stub').exists()).toBe(true)
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
      const wrapper = $mount(Image, {
        src: IMAGE_FAIL,
        slots: {
          error: () => {
            return 'error!'
          }
        }
      })
      wrapper.componentVM.loading = false
      wrapper.componentVM.error = true
      await nextTick()
      expect(wrapper.find('.el-image').text()).toBe('error!')
    })
  })
})
