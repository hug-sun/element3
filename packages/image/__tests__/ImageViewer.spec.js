import ImageViewer from '../ImageViewer.vue'
import { mount } from '@vue/test-utils'
describe('ImageViewer.vue', () => {
  describe('single', () => {
    it('urlList', () => {
      const wrapper = mount(ImageViewer, {
        props: {
          urlList: ['test.jpg']
        }
      })
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
        'test.jpg'
      )
    })
  })

  describe('list', () => {
    const wrapper = mount(ImageViewer, {
      props: {
        urlList: ['test.jpg', 'test2.jpg']
      }
    })
    const { componentVM } = wrapper

    it('init', () => {
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
        'test.jpg'
      )
      componentVM.next()
    }, 0.01)

    it('next', () => {
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
        'test2.jpg'
      )
      componentVM.prev()
    }, 0.02)

    it('prev', () => {
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
        'test.jpg'
      )
    }, 0.03)
  })

  it('initialIndex', () => {
    const wrapper = mount(ImageViewer, {
      props: {
        urlList: ['test.jpg', 'test2.jpg'],
        initialIndex: 1
      }
    })
    expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
      'test2.jpg'
    )
  })

  it('zIndex', () => {
    const wrapper = mount(ImageViewer, {
      props: {
        urlList: ['test.jpg'],
        zIndex: 2020
      }
    })
    expect(
      wrapper.find('.el-image-viewer__wrapper').attributes('style')
    ).toContain('z-index: 2020')
  })

  it('onSwitch', () => {
    const wrapper = mount(ImageViewer, {
      props: {
        urlList: ['test.jpg', 'test2.jpg'],
        onSwitch(newIndex) {
          expect(`switch to ${newIndex}`).toBe('switch to 1')
        }
      }
    })
    wrapper.componentVM.next()
  })

  it('onClose', () => {
    const wrapper = mount(ImageViewer, {
      props: {
        urlList: ['test.jpg', 'test2.jpg'],
        onClose() {
          expect('onClose').toBe('onClose')
        }
      }
    })
    wrapper.componentVM.hide()
  })
})
