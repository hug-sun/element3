import { nextTick } from 'vue'
import { useMount, testFileGet } from './lib/useHandler.js'
import Upload from '../src/upload.vue'

const Arrow = 'Arrow will try his best'
const action = 'TEST'

const mount = useMount(Upload, {
  props: {
    action
  },
  slots: {
    default: () => Arrow
  }
})

describe('<upload />', () => {
  describe('render test', () => {
    test('basic rendering', async () => {
      const wrapper = mount()
      expect(wrapper.text()).toEqual(Arrow)
      await wrapper.setProps({
        drag: true
      })
      expect(wrapper.find('.el-upload-dragger').exists()).toBe(true)
    })
  })

  describe('functionality', () => {
    test('works with keydown & click', async () => {
      const wrapper = mount()

      const click = jest.fn()
      wrapper.find('input').element.addEventListener('click', click, false)

      await wrapper.trigger('click')
      expect(click).toHaveBeenCalled()
      await wrapper.trigger('keydown', {
        key: 'Enter'
      })
      expect(click).toHaveBeenCalledTimes(2)

      await wrapper.trigger('keydown', {
        key: 'Space'
      })
      expect(click).toHaveBeenCalledTimes(3)
    })

    test('works when upload file exceeds the limit', async () => {
      const onExceed = jest.fn()
      const wrapper = mount({
        props: {
          onExceed,
          limit: 1
        }
      })
      const fileList = [
        new File(['content'], 'test-file.txt'),
        new File(['content'], 'test-file.txt')
      ]
      testFileGet(wrapper.find('input').element, fileList)

      await wrapper.find('input').trigger('change')
      expect(onExceed).toHaveBeenCalled()
    })

    test('onStart works', async () => {
      const onStart = jest.fn()
      const wrapper = mount({
        props: {
          onStart,
          autoUpload: false
        }
      })
      const fileList = [new File(['content'], 'test-file.txt')]

      testFileGet(wrapper.find('input').element, fileList)
      await wrapper.find('input').trigger('change')

      expect(onStart).toHaveBeenCalled()
    })

    test('beforeUpload works for rejecting upload', async () => {
      const beforeUpload = jest.fn(() => Promise.reject())
      const onRemove = jest.fn()
      const wrapper = mount({
        props: {
          beforeUpload,
          onRemove
        }
      })
      const fileList = [new File(['content'], 'test-file.txt')]

      testFileGet(wrapper.find('input').element, fileList)
      await wrapper.find('input').trigger('change')

      expect(beforeUpload).toHaveBeenCalled()
      await nextTick()
      expect(onRemove).toHaveBeenCalled()
    })

    test('beforeUpload works for resolving upload', async () => {
      const beforeUpload = jest.fn(() => Promise.resolve())
      const httpRequest = jest.fn(() => Promise.resolve())
      const onSuccess = jest.fn()
      const wrapper = mount({
        props: {
          beforeUpload,
          httpRequest,
          onSuccess
        }
      })
      const fileList = [new File(['content'], 'test-file.txt')]

      testFileGet(wrapper.find('input').element, fileList)
      await wrapper.find('input').trigger('change')

      expect(beforeUpload).toHaveBeenCalled()
      await nextTick()
      expect(onSuccess).toHaveBeenCalled()

      const onError = jest.fn()
      await wrapper.setProps({
        httpRequest: jest.fn(() => Promise.reject()),
        onError
      })
      await wrapper.find('input').trigger('change')
      await nextTick()
      expect(onError).toHaveBeenCalled()
    })

    test('onProgress should work', async () => {
      const onProgress = jest.fn()
      const httpRequest = jest.fn(({ onProgress }) => {
        onProgress()
        return Promise.resolve()
      })
      const wrapper = mount({
        props: {
          httpRequest,
          onProgress
        }
      })
      const fileList = [new File(['content'], 'test-file.txt')]

      testFileGet(wrapper.find('input').element, fileList)
      await wrapper.find('input').trigger('change')
      await nextTick()
      expect(onProgress).toHaveBeenCalled()
    })
  })
})
