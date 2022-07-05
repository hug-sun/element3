import { mount } from '@vue/test-utils'
import Row from '../Row.vue'

describe('Row.vue', () => {
  it('Row snapshot', () => {
    const wrapper = mount(Row)
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('Row class', () => {
    it('contain has class .el-row', () => {
      const wrapper = mount(Row)
      expect(wrapper.find('.el-row').exists()).toBe(true)
    })
    it('contain has class .el-row--flex', () => {
      const wrapper = mount(Row, {
        props: {
          type: 'flex',
        },
      })
      expect(wrapper.find('.el-row--flex').exists()).toBe(true)
    })
    it('contain has class .is-justify-end', () => {
      const wrapper = mount(Row, {
        props: {
          justify: 'end',
        },
      })
      expect(wrapper.find('.is-justify-end').exists()).toBe(true)
    })
    it('contain has class .is-align-bottom', () => {
      const wrapper = mount(Row, {
        props: {
          align: 'bottom',
        },
      })
      expect(wrapper.find('.is-align-bottom').exists()).toBe(true)
    })
  })

  it('Row gutter style', () => {
    const count = 10
    const gutter = count * 2
    const wrapper = mount(Row, {
      props: {
        gutter,
      },
    })
    expect(wrapper.attributes('style')).toBe(`margin-left: -${count}px; margin-right: -${count}px;`)
  })
})
