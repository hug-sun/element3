import Row from '../Row.js'
import { mount } from '@vue/test-utils'
describe('Row.vue', () => {
  it('create', () => {
    const wrapper = mount(Row)
    expect(wrapper.classes()).toContain('el-row')
  })
  it('gutter', () => {
    const wrapper = mount(Row, {
      props: {
        gutter: 20
      }
    })
    expect(wrapper.attributes('style')).toBe(
      'margin-left: -10px; margin-right: -10px;'
    )
  })

  it('type', () => {
    const wrapper = mount(Row, {
      props: {
        type: 'flex'
      }
    })
    expect(wrapper.classes()).toContain('el-row--flex')
  })
  it('justify', () => {
    const wrapper = mount(Row, {
      props: {
        justify: 'end'
      }
    })
    expect(wrapper.classes()).toContain('is-justify-end')
  })
  it('align', () => {
    const wrapper = mount(Row, {
      props: {
        align: 'bottom'
      }
    })
    expect(wrapper.classes()).toContain('is-align-bottom')
  })
})
