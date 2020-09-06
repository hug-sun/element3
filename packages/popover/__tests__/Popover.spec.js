import Popover from '../Popover.vue'
import { mount } from '@vue/test-utils'
import { ref } from '@vue/reactivity'
import { h, nextTick } from '@vue/runtime-core'

// console.log(123)

describe('Popover.vue', () => {
  describe('props', () => {
    it('title', () => {
      const wrapper = mount(Popover, {
        props: {
          title: '标题',
          trigger: 'hover',
          content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。'
        }
      })
      expect(wrapper.find('.el-popover__title').text()).toBe('标题')
    })

    it('disabled', async () => {
      const show = ref(false)
      const wrapper = mount(Popover, {
        props: {
          title: '标题',
          trigger: 'click',
          content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。',
          disabled: true,
          onShow() {
            show.value = true
          }
        },
        slots: {
          reference: h('button', 'click 激活')
        }
      })
      await wrapper.find('button').trigger('click')
      await nextTick(() => {
        expect(show.value).toBe(false)
      })
    })

    it('content', () => {
      const wrapper = mount(Popover, {
        props: {
          title: '标题',
          trigger: 'hover',
          content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。'
        }
      })
      expect(wrapper.html()).toContain(
        '这是一段内容,这是一段内容,这是一段内容,这是一段内容。'
      )
    })

    it('popperClass', () => {
      const wrapper = mount(Popover, {
        props: {
          title: '标题',
          trigger: 'hover',
          content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。',
          popperClass: 'test'
        }
      })
      expect(wrapper.find('.el-popover').classes()).toContain('test')
    })

    it('width', () => {
      const wrapper = mount(Popover, {
        props: {
          title: '标题',
          trigger: 'hover',
          width: '300',
          content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。'
        }
      })
      expect(wrapper.find('.el-popover').attributes().style).toContain(
        'width: 300px;'
      )
    })

    it('visibleArrow', () => {
      const wrapper = mount(Popover, {
        props: {
          title: '标题',
          trigger: 'hover',
          visibleArrow: false,
          content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。'
        }
      })
      expect(!!wrapper.find('.popper__arrow')).toBe(true)
    })

    it('tabindex', () => {
      const wrapper = mount(Popover, {
        props: {
          title: '标题',
          trigger: 'hover',
          tabindex: 3,
          content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。'
        },
        slots: {
          reference: h('button', 'tabindex')
        }
      })
      expect(wrapper.find('.el-popover__reference').attributes().tabindex).toBe(
        '3'
      )
    })

    it('openDelay', async () => {
      const show = ref(false)
      const wrapper = mount(Popover, {
        props: {
          title: '标题',
          trigger: 'hover',
          content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。',
          openDelay: 500,
          onShow() {
            show.value = true
          }
        },
        slots: {
          reference: h('button', 'hover 激活')
        }
      })
      await wrapper.find('button').trigger('mouseenter')
      await nextTick(() => {
        expect(show.value).toBe(false)
      })
      setTimeout(() => {
        expect(show.value).toBe(true)
      }, 600)
    })

    it('closeDelay', async () => {
      const show = ref(false)
      const wrapper = mount(Popover, {
        props: {
          title: '标题',
          trigger: 'hover',
          content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。',
          closeDelay: 500,
          onShow() {
            show.value = true
          }
        },
        slots: {
          reference: h('button', 'hover 激活')
        }
      })
      await wrapper.find('button').trigger('mouseenter')
      await wrapper.find('button').trigger('mouseleave')
      setTimeout(() => {
        expect(show.value).toBe(true)
      }, 400)
      setTimeout(() => {
        expect(show.value).toBe(false)
      }, 600)
    })
  })

  describe('trigger', () => {
    it('hover', async () => {
      const show = ref(false)
      const wrapper = mount(Popover, {
        props: {
          title: '标题',
          trigger: 'hover',
          content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。',
          onShow() {
            show.value = true
          }
        },
        slots: {
          reference: h('button', 'hover 激活')
        }
      })
      await wrapper.find('button').trigger('mouseenter')
      setTimeout(() => {
        expect(show.value).toBe(true)
      }, 100)
      await wrapper.find('button').trigger('mouseleave')
      setTimeout(() => {
        expect(show.value).toBe(false)
      }, 250)
    })

    it('click', async () => {
      const show = ref(false)
      const wrapper = mount(Popover, {
        props: {
          title: '标题',
          trigger: 'click',
          content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。',
          onShow() {
            show.value = true
          },
          onHide() {
            show.value = false
          }
        },
        slots: {
          reference: h('button', 'click 激活')
        }
      })
      await wrapper.find('button').trigger('click')
      await nextTick(() => {
        expect(show.value).toBe(true)
      })
      await wrapper.find('button').trigger('click')
      await nextTick(() => {
        expect(show.value).toBe(false)
      })
    })

    it('focus', async () => {
      const show = ref(false)
      const wrapper = mount(Popover, {
        props: {
          title: '标题',
          trigger: 'focus',
          content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。',
          onShow() {
            show.value = true
          },
          onHide() {
            show.value = false
          }
        },
        slots: {
          reference: h('button', 'focus 激活')
        }
      })
      await wrapper.find('button').trigger('focusin')
      await nextTick(() => {
        expect(show.value).toBe(true)
      })
      await wrapper.find('button').trigger('focusout')
      await nextTick(() => {
        expect(show.value).toBe(false)
      })
    })

    /* fixme：接收外部的vmodel 改变内部的showPopper值 暂时不知道怎么写测试用例 */
    // it('manual', async () => {
    //   const show = ref(false)
    //   const onClick = jest.fn()
    //   const wrapper = mount(Popover, {
    //     props: {
    //       title: '标题',
    //       trigger: 'manual',
    //       content: '这是一段内容,这是一段内容,这是一段内容,这是一段内容。',
    //     },
    //     slots: {
    //       reference: h('button', {
    //         listeners: {
    //           click: onClick
    //         }
    //       }, 'manual 激活')
    //     },
    //   })
    //   await wrapper.find('button').trigger('click')
    // await nextTick(() => {
    //   console.log(111111)
    //   console.log(show.value)
    //   expect(show.value).toBe(true)
    // })
    // await wrapper.find('button').trigger('click')
    // await nextTick(() => {
    //   expect(show.value).toBe(false)
    // })
    // })
  })
})
