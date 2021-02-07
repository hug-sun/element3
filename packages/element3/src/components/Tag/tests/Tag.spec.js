import Tag from '../src/Tag.vue'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import { setupGlobalOptions } from '../../../composables/globalConfig'

describe('Tag.vue', () => {
  it('snapshot', () => {
    const wrapper = mount(Tag)
    expect(wrapper.element).toMatchSnapshot()
  })
  it('normal render', () => {
    const wrapper = mount(Tag)
    const result = wrapper.findComponent(Tag).exists()

    expect(result).toBeTruthy()
  })
  it('content', () => {
    const wrapper = mount(Tag, {
      slots: {
        default: 'tag'
      }
    })
    const result = wrapper.findComponent(Tag).text()

    expect(result).toBe('tag')
  })
  describe('props', () => {
    it('type', () => {
      const type = 'success'
      const wrapper = mount(Tag, {
        props: {
          type
        }
      })
      const result = wrapper
        .findComponent(Tag)
        .find(`.el-tag--${type}`)
        .exists()

      expect(result).toBeTruthy()
    })
    it('closable', () => {
      const wrapper = mount(Tag, {
        props: {
          closable: true
        }
      })
      const result = wrapper.findComponent(Tag).find('.el-tag__close').exists()

      expect(result).toBeTruthy()
    })
    it('disable-transitions', async () => {
      let disableTransitions = ref(false)
      const wrapper = mount(Tag, {
        props: {
          closable: true,
          disableTransitions
        }
      })

      expect(wrapper.find('transition-stub').exists()).toBeTruthy()
      await nextTick(() => {
        disableTransitions.value = true
      })
      expect(wrapper.find('transition-stub').exists()).toBeFalsy()
    })
    it('hit', () => {
      const wrapper = mount(Tag, {
        props: {
          hit: true
        }
      })
      const result = wrapper.findComponent(Tag).find('.is-hit').exists()

      expect(result).toBeTruthy()
    })
    it('color', () => {
      const wrapper = mount(Tag, {
        props: {
          color: 'red'
        }
      })
      const result = wrapper
        .findComponent(Tag)
        .find('[style="background-color: red;"]')
        .exists()

      expect(result).toBeTruthy()
    })
    it('size', () => {
      const size = 'small'
      const wrapper = mount(Tag, {
        props: {
          size
        }
      })
      const result = wrapper
        .findComponent(Tag)
        .find(`.el-tag--${size}`)
        .exists()

      expect(result).toBeTruthy()
    })
    it('size by global config', () => {
      const size = 'small'
      const wrapper = mount(Tag, {
        global: {
          plugins: [
            setupGlobalOptions({
              size
            })
          ]
        }
      })
      const result = wrapper
        .findComponent(Tag)
        .find(`.el-tag--${size}`)
        .exists()

      expect(result).toBeTruthy()
    })
    it('effect', () => {
      const effect = 'dark'
      const wrapper = mount(Tag, {
        props: {
          effect
        }
      })
      const result = wrapper
        .findComponent(Tag)
        .find(`.el-tag--${effect}`)
        .exists()

      expect(result).toBeTruthy()
    })
  })
  describe('events', () => {
    it('close', async () => {
      const wrapper = mount(Tag, {
        props: {
          closable: true
        }
      })
      await wrapper.find('.el-tag__close').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('close')
      expect(wrapper.find('.el-tag').exists()).toBeFalsy()
    })
    it('click', async () => {
      const wrapper = mount(Tag)
      await wrapper.find('.el-tag').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('click')
    })
  })
})
