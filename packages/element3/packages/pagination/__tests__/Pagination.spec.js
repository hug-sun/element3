import { mount } from '@vue/test-utils'
import { ref, nextTick, h } from 'vue'
import Pager from '../components/Pager'
import Prev from '../components/Prev'
import Next from '../components/Next'
import Total from '../components/Total'
import Pagination from '../Pagination'
import Jumper from '../components/Jumper'
import { Input } from '../../../src/components/Input'
import Sizes from '../components/Sizes'

describe('components', () => {
  describe('Pager', () => {
    it('normal render', () => {
      const wrapper = mount(Pager)
      expect(wrapper.find('ul').exists()).toBeTruthy()
      expect(wrapper.findAll('li.number').length).toBe(5)
    })
    it('show next more', async () => {
      const wrapper = mount(Pager, {
        props: {
          pageCount: 100
        }
      })

      expect(wrapper.find('.btn-quickprev').exists()).toBeFalsy()
      expect(wrapper.find('.btn-quicknext').exists()).toBeTruthy()
      await wrapper.find('.btn-quicknext').trigger('click')
      expect(wrapper.emitted()['update:currentPage'][0]).toEqual([6])
    })
    it('show prev more', async () => {
      const wrapper = mount(Pager, {
        props: {
          currentPage: 97,
          pageCount: 100
        }
      })

      await nextTick()
      expect(wrapper.find('.btn-quickprev').exists()).toBeTruthy()
      expect(wrapper.find('.btn-quicknext').exists()).toBeFalsy()
      await wrapper.find('.btn-quickprev').trigger('click')
      expect(wrapper.emitted()['update:currentPage'][0]).toEqual([92])
    })
    it('show both more', async () => {
      const wrapper = mount(Pager, {
        props: {
          currentPage: 50,
          pageCount: 100
        }
      })

      await nextTick()
      expect(wrapper.find('.btn-quickprev').exists()).toBeTruthy()
      expect(wrapper.find('.btn-quicknext').exists()).toBeTruthy()
    })
    it('click event', async () => {
      const currentPage = ref(1)
      const wrapper = mount(Pager, {
        props: {
          currentPage,
          pageCount: 100,
          'onUpdate:currentPage'(val) {
            currentPage.value = val
          }
        }
      })

      await nextTick()
      expect(currentPage.value).toBe(1)
      expect(wrapper.find('.btn-quickprev').exists()).toBeFalsy()
      expect(wrapper.find('.btn-quicknext').exists()).toBeTruthy()
      await wrapper.findAll('.number')[6].trigger('click')
      expect(wrapper.find('.btn-quickprev').exists()).toBeTruthy()
      expect(wrapper.find('.btn-quicknext').exists()).toBeFalsy()
      expect(currentPage.value).toBe(100)
    })
  })

  describe('Prev', () => {
    it('normal render', () => {
      const wrapper = mount(Prev)

      expect(wrapper.find('.btn-prev').exists()).toBeTruthy()
    })
    it('prevText', () => {
      const wrapper = mount(Prev, {
        props: {
          prevText: '1'
        }
      })

      expect(wrapper.text()).toBe('1')
    })
    it('click event', async () => {
      const prev = jest.fn()
      const wrapper = mount(Prev, {
        props: {
          currentPage: 10,
          prev
        }
      })

      await wrapper.trigger('click')
      expect(prev).toBeCalled()
    })
    it('disabled', async () => {
      // disabled has two situations:
      //    first: disabled set true
      const prev = jest.fn()
      const wrapper = mount(Prev, {
        props: {
          disabled: true,
          currentPage: 10,
          prev
        }
      })
      //    second: currentPage equal 1
      const wrapper2 = mount(Prev, {
        props: {
          prev
        }
      })

      await wrapper.trigger('click')
      expect(prev).not.toBeCalled()
      await wrapper2.trigger('click')
      expect(prev).not.toBeCalled()
    })
  })

  describe('Next', () => {
    it('normal render', () => {
      const wrapper = mount(Next)

      expect(wrapper.find('.btn-next').exists()).toBeTruthy()
    })
    it('nextText', () => {
      const wrapper = mount(Next, {
        props: {
          nextText: '1'
        }
      })

      expect(wrapper.text()).toBe('1')
    })
    it('click event', async () => {
      const next = jest.fn()
      const wrapper = mount(Next, {
        props: {
          currentPage: 10,
          next
        }
      })

      await wrapper.trigger('click')
      expect(next).toBeCalled()
    })
    it('disabled', async () => {
      // disabled has three situations:
      //    first: disabled set true
      const next = jest.fn()
      const wrapper = mount(Next, {
        props: {
          disabled: true,
          currentPage: 10,
          next
        }
      })
      //    second: currentPage equal pageCount
      const wrapper2 = mount(Next, {
        props: {
          currentPage: 3,
          pageCount: 3,
          next
        }
      })
      //    third: pageCount equal 0 (why not <= 1? because second situation include this)
      const wrapper3 = mount(Next, {
        props: {
          pageCount: 0,
          next
        }
      })

      await wrapper.trigger('click')
      expect(next).not.toBeCalled()
      await wrapper2.trigger('click')
      expect(next).not.toBeCalled()
      await wrapper3.trigger('click')
      expect(next).not.toBeCalled()
    })
  })

  describe('Jumper', () => {
    it('handleChange', async () => {
      const currentPage = ref(1)
      const wrapper = mount(Jumper, {
        props: {
          currentPage,
          onChange(val) {
            currentPage.value = Number(val)
          }
        },
        global: {
          components: {
            Input
          }
        }
      })

      await wrapper.find('input').setValue(3)
      await wrapper.trigger('keydown', 13)
      expect(currentPage.value).toBe(3)
    })
  })

  describe('Sizes', () => {
    it('normal render', () => {
      const wrapper = mount(Sizes, {
        props: {
          pageSizes: [10, 20, 30],
          pageSize: 10,
          handleChange() {},
          watchHandler() {}
        }
      })

      expect(wrapper.findAll('li').length).toBe(3)
    })
  })

  describe('Total', () => {
    it('total prop is number', () => {
      const wrapper = mount(Total, {
        props: {
          total: 5
        }
      })

      expect(wrapper.find('.el-pagination__total').exists()).toBeTruthy()
    })
    it('total prop is not number', () => {
      const wrapper = mount(Total, {
        props: {
          total: undefined
        }
      })

      expect(wrapper.find('.el-pagination__total').exists()).toBeFalsy()
    })
  })
})

describe('Pagination', () => {
  describe('props', () => {
    it('layout', () => {
      const wrapper = mount(Pagination, {
        props: {
          layout: 'prev, slot, next'
        },
        slots: {
          default: h('div', { class: 'slot' }, 'slot')
        }
      })

      expect(wrapper.find('.btn-prev').exists()).toBeTruthy()
      expect(wrapper.find('.slot').exists()).toBeTruthy()
      expect(wrapper.find('.btn-next').exists()).toBeTruthy()
    })
    it('no currentPage', async () => {
      const wrapper = mount(Pagination)

      expect(wrapper.find('.active').text()).toBe('1')
      await wrapper.findAll('.number')[1].trigger('click')
      expect(wrapper.find('.active').text()).toBe('2')
    })
    it('total', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 30
        }
      })

      expect(wrapper.findAll('.number').length).toBe(3)
      expect(wrapper.find('.el-pagination__total').text()).toContain('30')
    })
    it('pageSize', () => {
      const wrapper = mount(Pagination, {
        props: {
          total: 10,
          pageSize: 2
        }
      })

      expect(wrapper.findAll('.number').length).toBe(5)
    })
    it('currentChange', async () => {
      const currentPage = ref(1)
      const wrapper = mount(Pagination, {
        props: {
          currentPage,
          onCurrentChange(val) {
            currentPage.value = val
          }
        }
      })

      await wrapper.findAll('.number')[3].trigger('click')
      expect(currentPage.value).toBe(4)
    })
    it('hide-on-single-page', () => {
      const wrapper = mount(Pagination, {
        props: {
          hideOnSinglePage: true,
          pageCount: 1
        }
      })
      const wrapper2 = mount(Pagination, {
        props: {
          hideOnSinglePage: true,
          pageCount: 5
        }
      })

      expect(wrapper.find('.el-pagination').exists()).toBeFalsy()
      expect(wrapper2.find('.el-pagination').exists()).toBeTruthy()
    })
    it('sizeChange', async () => {
      const pageSize = ref(10)
      const onSizeChange = jest.fn()
      const wrapper = mount(Pagination, {
        props: {
          layout: 'pager, sizes',
          pageSize,
          onSizeChange
        }
      })

      await wrapper.findAll('.el-select-dropdown__item')[2].trigger('click')
      expect(onSizeChange).toBeCalled()
    })
    it('pageSizes', () => {
      const wrapper = mount(Pagination, {
        props: {
          layout: 'pager, sizes',
          pageSizes: [10, 20]
        }
      })

      expect(wrapper.findAll('.el-select-dropdown__item').length).toBe(2)
    })
  })

  describe('ability', () => {
    it('change current-page by Jumper', async () => {
      const currentPage = ref(1)
      const wrapper = mount(Pagination, {
        props: {
          layout: 'pager, jumper',
          currentPage,
          'onUpdate:currentPage'(val) {
            currentPage.value = val
          }
        }
      })
      await wrapper.find('input').setValue(3)
      await wrapper.trigger('keydown', 13)
      expect(currentPage.value).toBe(3)
      await wrapper.find('input').setValue(10)
      await wrapper.trigger('keydown', 13)
      expect(currentPage.value).toBe(5)
    })
    it('change current-page by Prev', async () => {
      const onPrevClick = jest.fn()
      const wrapper = mount(Pagination, {
        props: {
          layout: 'prev, pager',
          currentPage: 2,
          onPrevClick
        }
      })

      await wrapper.findComponent(Prev).trigger('click')
      expect(onPrevClick).toBeCalled()
    })
    it('cannot change current-page by Prev', async () => {
      const onPrevClick = jest.fn()
      const wrapper = mount(Pagination, {
        props: {
          layout: 'prev, pager',
          currentPage: 1,
          onPrevClick
        }
      })

      await wrapper.findComponent(Prev).trigger('click')
      expect(onPrevClick).not.toBeCalled()
    })
    it('change current-page by Next', async () => {
      const onNextClick = jest.fn()
      const wrapper = mount(Pagination, {
        props: {
          layout: 'pager, next',
          currentPage: 4,
          onNextClick
        }
      })

      await wrapper.findComponent(Next).trigger('click')
      expect(onNextClick).toBeCalled()
    })
    it('cannot change current-page by Next', async () => {
      const onNextClick = jest.fn()
      const wrapper = mount(Pagination, {
        props: {
          layout: 'pager, next',
          currentPage: 5,
          onNextClick
        }
      })

      await wrapper.findComponent(Next).trigger('click')
      expect(onNextClick).not.toBeCalled()
    })
  })
})
