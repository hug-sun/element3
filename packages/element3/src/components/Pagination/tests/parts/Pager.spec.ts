import { mount } from '@vue/test-utils'
import { Pager } from '../../src/entity/Pager'
import ElPager from '../../src/parts/Pager.vue'

describe('Pager.vue', () => {
  it('show page pageCount <= pagerCount', () => {
    const pager = new Pager(5, 3, 7)
    const wrapper = mount(ElPager, {
      props: {
        pager
      }
    })

    expect(wrapper.findAll('.number')).toHaveLength(5)
    expect(wrapper.findAll('.number').map((item) => item.text())).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5'
    ])
    expect(wrapper.find('.number.active').text()).toBe('3')
    expect(wrapper.findAll('.el-icon.more')).toHaveLength(0)
  })
  it('show page pageCount > pagerCount currentPage is 4', () => {
    const pager = new Pager(30, 4, 7)

    const wrapper = mount(ElPager, {
      props: {
        pager
      }
    })

    expect(wrapper.findAll('.number')).toHaveLength(7)
    expect(wrapper.find('.el-icon.more.btn-quickprev').exists()).toBeFalsy()
    expect(wrapper.find('.el-icon.more.btn-quicknext').exists()).toBeTruthy()
  })
  it('show page pageCount > pagerCount currentPage is 27', () => {
    const pager = new Pager(30, 27, 7)

    const wrapper = mount(ElPager, {
      props: {
        pager
      }
    })

    expect(wrapper.findAll('.number')).toHaveLength(7)
    expect(wrapper.find('.el-icon.more.btn-quickprev').exists()).toBeTruthy()
    expect(wrapper.find('.el-icon.more.btn-quicknext').exists()).toBeFalsy()
  })
  it('show page pageCount > pagerCount', () => {
    const pager = new Pager(30, 10, 7)

    const wrapper = mount(ElPager, {
      props: {
        pager
      }
    })

    expect(wrapper.findAll('.number')).toHaveLength(7)
    expect(wrapper.findAll('.el-icon.more')).toHaveLength(2)
    expect(wrapper.find('.number.active').text()).toBe('10')
  })

  it('when pageCount less', () => {
    const currentPage = 1
    const pageCount = 2
    const pagerCount = 7
    const wrapper = mount(ElPager, {
      props: {
        pager: new Pager(pageCount, currentPage, pagerCount)
      }
    })

    expect(wrapper.findAll('.number')).toHaveLength(2)
    expect(wrapper.findAll('.number').map((item) => item.text())).toEqual([
      '1',
      '2'
    ])
    expect(wrapper.find('.number.active').text()).toBe('1')
  })
})
