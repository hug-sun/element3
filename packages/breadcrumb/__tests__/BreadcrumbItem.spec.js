import BreadcrumbItem from '../BreadcrumbItem.vue'
import Breadcrumb from '../Breadcrumb.vue'
import { mount } from '@vue/test-utils'

describe('BreadcrumbItem.Vue', () => {
  describe('BreadcrumbItem attributes', () => {
    test('test items number', () => {
      const wrapper = mount({
        components: {
          'el-breadcrumb-item': BreadcrumbItem,
          'el-breadcrumb': Breadcrumb
        },
        template: `
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
          </el-breadcrumb>
        `
      })

      const separators = wrapper.findAll('span.el-breadcrumb__separator')
      expect(separators).toHaveLength(2)
    })

    test('test attribute :to and no :to', () => {
      const wrapper = mount({
        components: {
          'el-breadcrumb-item': BreadcrumbItem,
          'el-breadcrumb': Breadcrumb
        },
        template: `
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/bc'}" >活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
          </el-breadcrumb>
        `
      })

      const linkItems = wrapper.findAll('span.is-link')
      expect(linkItems).toHaveLength(2)
      expect(wrapper.findAll('[role="link"]')).toHaveLength(3)
    })

    test('test attribute :replace', async () => {
      const wrapper = mount({
        components: {
          'el-breadcrumb-item': BreadcrumbItem,
          'el-breadcrumb': Breadcrumb
        },
        template: `
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/abc'}" :replace="true">活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
          </el-breadcrumb>
        `
      })

      const linkItems = wrapper.findAll('span.is-link')

      linkItems[1].trigger('click')
      expect(linkItems).toHaveLength(2)
    })
  })
})
