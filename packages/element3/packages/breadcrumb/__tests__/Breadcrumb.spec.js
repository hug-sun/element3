import BreadcrumbItem from '../BreadcrumbItem.vue'
import Breadcrumb from '../Breadcrumb.vue'
import { mount } from '@vue/test-utils'

describe('Breadcrumb.Vue', () => {
  describe('breadcrumb separators', () => {
    test('default separator should be /', () => {
      const wrapper = mount({
        components: {
          'el-breadcrumb-item': BreadcrumbItem,
          'el-breadcrumb': Breadcrumb
        },
        template: `
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
          </el-breadcrumb>
        `
      })

      const separators = wrapper.findAll('span.el-breadcrumb__separator')
      separators.forEach((separator) => expect(separator.text()).toBe('/'))
      expect(separators).toHaveLength(1)
    })

    test('test other separator', () => {
      const wrapper = mount({
        components: {
          'el-breadcrumb-item': BreadcrumbItem,
          'el-breadcrumb': Breadcrumb
        },
        template: `
          <el-breadcrumb separator="|">
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            <el-breadcrumb-item>活动2详情</el-breadcrumb-item>
          </el-breadcrumb>
        `
      })

      const separators = wrapper.findAll('span.el-breadcrumb__separator')
      separators.forEach((separator) => expect(separator.text()).toBe('|'))
      expect(separators).toHaveLength(2)
    })

    test('test other separator', () => {
      const wrapper = mount({
        components: {
          'el-breadcrumb-item': BreadcrumbItem,
          'el-breadcrumb': Breadcrumb
        },
        template: `
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            <el-breadcrumb-item>活动2详情</el-breadcrumb-item>
            <el-breadcrumb-item>活动3详情</el-breadcrumb-item>
          </el-breadcrumb>
        `
      })

      const separators = wrapper.findAll('i.el-breadcrumb__separator')
      // it is icon
      separators.forEach((separator) => expect(separator.text()).toBe(''))
      expect(separators).toHaveLength(3)
    })
  })
})
