import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ImageViewer from '../ImageViewer.vue'
import { IMAGE_FAIL, IMAGE_SUCCESS } from './image'
describe('ImageViewer.vue', () => {
  describe('single', () => {
    it('should render props.urlList', async () => {
      const wrapper = mount(ImageViewer, {
        props: {
          urlList: [IMAGE_SUCCESS]
        }
      })

      await nextTick()
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
        IMAGE_SUCCESS
      )
      expect(wrapper.find('.el-image-viewer__prev').exists()).toBe(false)
      expect(wrapper.find('.el-image-viewer__next').exists()).toBe(false)
    })
  })

  describe('zoom', () => {
    it('click zoom-btn image should be zoom', async () => {
      const wrapper = mount(ImageViewer, {
        props: {
          urlList: [IMAGE_SUCCESS]
        }
      })

      wrapper.find('.el-icon-zoom-out').trigger('click')
      await nextTick()

      expect(
        wrapper.find('.el-image-viewer__img').attributes('style')
      ).toContain(`transform: scale(0.8)`)

      wrapper.find('.el-icon-zoom-in').trigger('click')
      await nextTick()

      expect(
        wrapper.find('.el-image-viewer__img').attributes('style')
      ).toContain(`transform: scale(1)`)
    })
  })

  describe('rotate', () => {
    it('click rotate-btn image should be rotate', async () => {
      const wrapper = mount(ImageViewer, {
        props: {
          urlList: [IMAGE_SUCCESS]
        }
      })

      wrapper.find('.el-icon-refresh-left').trigger('click')
      await nextTick()

      expect(
        wrapper.find('.el-image-viewer__img').attributes('style')
      ).toContain(`rotate(-90deg)`)

      wrapper.find('.el-icon-refresh-right').trigger('click')
      await nextTick()

      expect(
        wrapper.find('.el-image-viewer__img').attributes('style')
      ).toContain(`rotate(0deg)`)
    })
  })

  describe('toggle', () => {
    it('click toggle-btn image should be auto width and height', async () => {
      const wrapper = mount(ImageViewer, {
        props: {
          urlList: [IMAGE_SUCCESS]
        }
      })

      wrapper.find('.el-image-viewer-toggle-btn').trigger('click')
      await nextTick()

      expect(
        wrapper.find('.el-image-viewer__img').attributes('style')
      ).not.toContain(`max-height: 100%; max-width: 100%;`)

      wrapper.find('.el-image-viewer-toggle-btn').trigger('click')
      await nextTick()

      expect(
        wrapper.find('.el-image-viewer__img').attributes('style')
      ).toContain(`max-height: 100%; max-width: 100%;`)
    })
  })

  describe('action btn', () => {
    const wrapper = mount(ImageViewer, {
      props: {
        urlList: [IMAGE_SUCCESS, IMAGE_FAIL]
      }
    })

    it('should render init picture url', () => {
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
        IMAGE_SUCCESS
      )
    })

    it('click next btn show next pictrue', async () => {
      await wrapper.find('.el-image-viewer__next').trigger('click')
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
        IMAGE_FAIL
      )
    })

    it('click prev btn show prev pictrue', async () => {
      await wrapper.find('.el-image-viewer__prev').trigger('click')
      expect(wrapper.find('.el-image-viewer__img').attributes('src')).toBe(
        IMAGE_SUCCESS
      )
    })
  })

  it('should render pircture index of props.initialIndex ', () => {
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

  it('should render props.zIndex', () => {
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
    await wrapper.find('.el-image-viewer__btn').trigger('click')
    expect(caller).toBe(true)
  })
})
