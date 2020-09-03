import { mount } from '@vue/test-utils'
import Col from '../Col'
import Row from '../../row/Row'

describe('Col', () => {
  describe('props', () => {
    it('create', () => {
      const wrapper = mount(Col, {
        props: {
          span: 12
        }
      })
      expect(wrapper.classes()).toContain('el-col')
    })
    it('span', () => {
      const wrapper = mount(Col, {
        props: {
          span: 12
        }
      })
      expect(wrapper.classes()).toContain('el-col-12')
    })
    it('pull', () => {
      const wrapper = mount(Col, {
        props: {
          span: 12,
          pull: 3
        }
      })
      expect(wrapper.classes()).toContain('el-col-pull-3')
    })
    it('push', () => {
      const wrapper = mount(Col, {
        props: {
          span: 12,
          push: 3
        }
      })
      expect(wrapper.classes()).toContain('el-col-push-3')
    })
    it('gutter', () => {
      const wrapper = mount({
        template: `
          <el-row :gutter="20">
            <el-col :span="12" ref="col">
            </el-col>
          </el-row>
        `,
        components: {
          'el-col': Col,
          'el-row': Row
        }
      })
      const colElm = wrapper.find('.el-col').element
      expect(colElm.style.paddingLeft).toEqual('10px')
      expect(colElm.style.paddingRight).toEqual('10px')
    })
    it('responsive', () => {
      const wrapper = mount({
        template: `
          <el-row :gutter="20">
            <el-col ref="col" :sm="{ span: 4, offset: 2 }" :md="8" :lg="{ span: 6, offset: 3 }">
            </el-col>
          </el-row>
        `,
        components: {
          'el-col': Col,
          'el-row': Row
        }
      })
      const colElm = wrapper.find('.el-col')
      expect(colElm.classes()).toContain('el-col-sm-4')
      expect(colElm.classes()).toContain('el-col-sm-offset-2')
      expect(colElm.classes()).toContain('el-col-lg-6')
      expect(colElm.classes()).toContain('el-col-lg-offset-3')
      expect(colElm.classes()).toContain('el-col-md-8')
    })
  })
})
