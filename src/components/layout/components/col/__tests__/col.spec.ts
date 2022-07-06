import { mount } from '@vue/test-utils'
import Row from '../../row/Row.vue'
import Col from '../Col.vue'

describe('Col.vue', () => {
  it('Col snapshot', () => {
    const wrapper = mount(Col)
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('Col class', () => {
    it ('contain has class .el-col', () => {
      const wrapper = mount(Col)
      expect(wrapper.find('.el-col').exists()).toBe(true)
    })
    it('contain has class .el-col-{num}', () => {
      const num = 12
      const wrapper = mount(Col, {
        props: {
          span: num,
        },
      })
      expect(wrapper.find(`.el-col-${num}`).exists()).toBe(true)
    })
    it('contain has class .el-col-pull-{num}', () => {
      const num = 3
      const wrapper = mount(Col, {
        props: {
          pull: num,
        },
      })
      expect(wrapper.find(`.el-col-pull-${num}`).exists()).toBe(true)
    })
    it('contain has class .el-col-push-{num}', () => {
      const num = 6
      const wrapper = mount(Col, {
        props: {
          push: num,
        },
      })
      expect(wrapper.find(`.el-col-push-${num}`).exists()).toBe(true)
    })
  })

  it('Col gutter style', () => {
    const count = 10
    const gutter = count * 2
    const wrapper = mount({
      template: `
        <el-row :gutter="${gutter}">
          <el-col>hello world</el-col>
        </el-row>
      `,
      components: {
        'el-row': Row,
        'el-col': Col,
      },
    })
    expect(wrapper.find('.el-col').exists()).toBe(true)
    expect(wrapper.find('.el-col').attributes('style')).toBe(`padding-left: ${count}px; padding-right: ${count}px;`)
  })

  it('The responsive', () => {
    const wrapper = mount({
      template: `
        <el-row :gutter="22">
          <el-col 
            :xs="{span: 22, offset: 2}" 
            :sm="{span: 18, offset: 4}" 
            :md="22" 
            :lg="{span: 20, offset: 2}"
            :xl="18"
          >
            hello world
          </el-col>
        </el-row>
      `,
      components: {
        'el-row': Row,
        'el-col': Col,
      },
    })
    expect(wrapper.find('.el-col').exists()).toBe(true)
    expect(wrapper.find('.el-row').find('.el-col').attributes('style')).toBe('padding-left: 11px; padding-right: 11px;')
    expect(wrapper.find('.el-row').find('.el-col-xs-22').exists()).toBe(true)
    expect(wrapper.find('.el-row').find('.el-col-xs-offset-2').exists()).toBe(true)
    expect(wrapper.find('.el-row').find('.el-col-sm-18').exists()).toBe(true)
    expect(wrapper.find('.el-row').find('.el-col-sm-offset-4').exists()).toBe(true)
    expect(wrapper.find('.el-row').find('.el-col-md-22').exists()).toBe(true)
    expect(wrapper.find('.el-row').find('.el-col-lg-20').exists()).toBe(true)
    expect(wrapper.find('.el-row').find('.el-col-lg-offset-2').exists()).toBe(true)
    expect(wrapper.find('.el-row').find('.el-col-xl-18').exists()).toBe(true)
  })
})
