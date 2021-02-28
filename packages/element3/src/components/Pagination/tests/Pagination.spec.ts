import { mount } from '@vue/test-utils'
import Pagination from '../src/Pagination.vue'
import Prev from '../src/parts/Prev.vue'
import Next from '../src/parts/Next.vue'
import Pager from '../src/parts/Pager.vue'

describe('Pagination.vue', () => {
  it('Realize layout prev,pager,next', () => {
    const wrapper = mount(Pagination, {
      props: {
        layout: 'prev, pager, next',
        currentPage: 2,
        pageCount: 5
      }
    })

    expect(wrapper.findComponent(Prev).exists()).toBeTruthy()
    expect(wrapper.findComponent(Next).exists()).toBeTruthy()
    expect(wrapper.findComponent(Pager).exists()).toBeTruthy()
  })
  it('Realize simple paging display', () => {
    const wrapper = mount(Pagination, {
      props: {
        layout: 'prev, pager, next',
        currentPage: 2,
        pageCount: 5
      }
    })

    expect(wrapper.find('.btn-prev').exists()).toBeTruthy()
    expect(wrapper.findAll('.el-pager .number')).toHaveLength(5)
    expect(wrapper.find('.el-pager .number.active').text()).toBe('2')
    expect(wrapper.find('.btn-next').exists()).toBeTruthy()
  })
})
