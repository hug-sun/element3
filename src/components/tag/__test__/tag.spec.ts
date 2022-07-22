import { mount } from '@vue/test-utils'
import Tag from '../Tag.vue'

describe('Tag.vue', () => {
  it('Tag slots will be rendered', () => {
    const vm = mount(Tag, {
      slots: {
        default: 'tag one',
      },
    })

    expect(vm.text()).toBe('tag one')
  })

  it('should render props.type && tag container has classes', () => {
    const vm = mount(Tag, {
      props: {
        type: 'success',
      },
    })

    expect(vm.props('type')).toBe('success')
    expect(vm.find('span').classes()).toContain('el-tag--success')
  })

  it('close-icon will be show', () => {
    const vm = mount(Tag, {
      props: {
        closable: true,
      },
    })

    expect(vm.props('closable')).toBe(true)
    const text = vm.find('.el-icon-close')
    expect(text.classes()).toContain('el-tag__close')
  })

  it('click close-icon will be effective', async () => {
    const vm = mount(Tag, {
      props: {
        closable: true,
      },
    })

    await vm.find('.el-tag__close').trigger('click')
    expect(vm.emitted()).toHaveProperty('close')
  })

  it('click close-icon parent`s event trigger will be effective', async () => {
    const wrapper = {
      template: `
      <div>
        <tag @close="showTag = false" closable v-if="showTag">111</tag>
      </div>
      `,
      data() {
        return { showTag: true }
      },
      components: { Tag },
    }
    const vm = mount(wrapper)
    const ElTag = vm.find('.el-tag')

    await ElTag.find('.el-tag__close').trigger('click')
    expect(ElTag.exists()).toBe(true)
  })

  it('introduce hit prop will be effective', () => {
    const vm = mount(Tag, {
      props: {
        hit: true,
      },
    })

    expect(vm.find('.el-tag').classes()).toContain('is-hit')
  })

  it('checks the inline style color', () => {
    const vm = mount(Tag, {
      props: {
        color: 'blue',
      },
    })
    const ElTag = vm.find('.el-tag')
    expect(ElTag.attributes('style')).toBe('color: blue;')
  })

  it('introduce size prop will be effective', () => {
    const vm = mount(Tag, {
      props: {
        size: 'small',
      },
    })
    const ElTag = vm.find('.el-tag')
    expect(ElTag.classes()).toContain('el-tag--small')
  })

  it('introduce effect prop will be effective', () => {
    const vm = mount(Tag)
    const ElTag = vm.find('.el-tag')
    expect(ElTag.classes()).toContain('el-tag--light')
  })

  it('click emitted', async () => {
    const wrapper = mount(Tag)
    await wrapper.find('.el-tag').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
