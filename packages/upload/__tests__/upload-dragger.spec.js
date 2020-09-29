import { provide, h, defineComponent } from 'vue'
import { useMount } from './lib/useHandler.js'
import UploadDragger from '../src/upload-dragger.vue'

const Arrow = 'Arrow will try his best'

const Wrapper = defineComponent({
  props: {
    onDrop: Function
  },
  setup(props, { slots }) {
    provide('uploader', { accept: 'video/*' })
    return () => h(UploadDragger, props, slots)
  }
})
const mount = useMount(Wrapper, {
  slots: {
    default: () => Arrow
  }
})

describe('<upload-dragger />', () => {
  describe('render test', () => {
    test('should render correct', () => {
      const wrapper = mount()

      expect(wrapper.text()).toBe(Arrow)
    })
  })

  describe('functionality', () => {
    test('onDrag works', async () => {
      const wrapper = mount()
      await wrapper.find('.el-upload-dragger').trigger('dragover')
      expect(wrapper.classes('is-dragover')).toBe(true)
    })

    test('ondrop works for any given video type', async () => {
      const onDrop = jest.fn()
      const wrapper = mount({
        props: {
          onDrop
        }
      })
      const dragger = wrapper.findComponent(UploadDragger)

      await dragger.trigger('drop', {
        dataTransfer: {
          files: [
            {
              type: 'video/mp4',
              name: 'test.mp4'
            }
          ]
        }
      })
      expect(onDrop).toHaveBeenCalledTimes(1)
      expect(dragger.emitted('file')).toHaveLength(1)
      await dragger.trigger('drop', {
        dataTransfer: {
          files: [
            {
              type: 'video/mov',
              name: 'test.mov'
            }
          ]
        }
      })
      expect(dragger.emitted('file')).toHaveLength(2)
    })
  })
})
