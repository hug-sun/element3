import { mount } from '@vue/test-utils'
import ImageViewer from '../ImageViewer.vue'
import { IMAGE_FAIL, IMAGE_SUCCESS } from './image'
describe('ImageViewer.vue', () => {
  describe('single', () => {
    it('urlList', () => {
      const wrapper = mount(ImageViewer, {
        props: {
          urlList: [IMAGE_SUCCESS]
        }
      })
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
        IMAGE_SUCCESS
      )
    })
  })

  describe('list', () => {
    const wrapper = mount(ImageViewer, {
      props: {
        urlList: [IMAGE_SUCCESS, IMAGE_FAIL]
      }
    })

    it('init', () => {
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
        IMAGE_SUCCESS
      )
    })

    it('next', async () => {
      await wrapper.find('.el-image-viewer__next').trigger('click')
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
        IMAGE_FAIL
      )
    })

    it('prev', async () => {
      await wrapper.find('.el-image-viewer__prev').trigger('click')
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
        IMAGE_SUCCESS
      )
    })
  })

  it('initialIndex', () => {
    const wrapper = mount(ImageViewer, {
      props: {
        urlList: [IMAGE_SUCCESS, IMAGE_FAIL],
        initialIndex: 1
      }
    })
    expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
      IMAGE_FAIL
    )
  })

  it('zIndex', () => {
    const wrapper = mount(ImageViewer, {
      props: {
        urlList: [IMAGE_SUCCESS],
        zIndex: 2020
      }
    })
    expect(
      wrapper.find('.el-image-viewer__wrapper').attributes('style')
    ).toContain('z-index: 2020')
  })

  it('onSwitch', async () => {
    let caller = false
    const wrapper = mount(ImageViewer, {
      props: {
        urlList: [IMAGE_SUCCESS, IMAGE_FAIL],
        onSwitch() {
          caller = true
        }
      }
    })
    await wrapper.componentVM.next()
    expect(caller).toBe(true)
  })

  it('onClose', async () => {
    let caller = false
    const wrapper = mount(ImageViewer, {
      props: {
        urlList: [IMAGE_SUCCESS, IMAGE_SUCCESS],
        onClose() {
          caller = true
        }
      }
    })
    await wrapper.componentVM.hide()
    expect(caller).toBe(true)
  })
})
