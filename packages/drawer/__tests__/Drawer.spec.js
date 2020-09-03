import Drawer from '../Drawer.vue'
import { mount } from '@vue/test-utils'

/**
 * 等待 ms 毫秒，返回 Promise
 * @param {Number} ms
 */
export const wait = function (ms = 50) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms))
}

/**
 * 等待一个 Tick，代替 Vue.nextTick，返回 Promise
 */
export const waitImmediate = () => wait(0)

const title = '我是测试 title'
const content = 'content'

describe('Drawer', () => {
  it('create', async () => {
    const Comp = {
      template: `
        <Drawer :title='title' v-model:visible='visible'></Drawer>
      `
    }
    const wrapper = mount(Comp, {
      global: {
        components: {
          Drawer
        }
      },
      data() {
        return {
          title,
          visible: true
        }
      }
    })
    await waitImmediate()
    expect(wrapper.find('.el-drawer__header').text()).toBe(title)
    expect(wrapper.find('.el-drawer').attributes().display).not.toBe('none')
  })

  it('render correct content', async () => {
    const wrapper = mount(Drawer, {
      slots: {
        default: `<span>这是一段信息</span>
        <button>取消</button>
        <button>确定</button>`
      },
      props: {
        title: 'drawer test',
        visible: true
      }
    })
    await waitImmediate()
    expect(wrapper.find('.el-drawer__body span').text()).toBe('这是一段信息')
    const footerBtns = wrapper.findAll('.el-drawer__body button')
    expect(footerBtns.length).toBe(2)
    expect(footerBtns[0].text()).toBe('取消')
    expect(footerBtns[1].text()).toBe('确定')
  })

  it('should effect height when drawer is vertical', async () => {
    const wrapper = mount(Drawer, {
      props: {
        title,
        visible: true,
        direction: 'ltr'
      }
    })
    expect(wrapper.find('.el-drawer').attributes().style).toBe('width: 30%;')
  })

  it('should effect width when drawer is horizontal', async () => {
    const wrapper = mount(Drawer, {
      props: {
        title,
        visible: true,
        direction: 'ttd',
        size: '50%'
      }
    })

    expect(wrapper.find('.el-drawer').attributes().style).toBe('height: 50%;')
  })

  describe('directions', () => {
    const renderer = (direction) => {
      const Comp = {
        template: `
          <Drawer :title='title' v-model:visible='visible' direction='${direction}'>
            <span>${content}</span>
          </Drawer>`
      }
      return mount(Comp, {
        global: {
          components: {
            Drawer
          }
        },
        data() {
          return {
            title,
            visible: true
          }
        }
      })
    }
    it('should render from left to right', async () => {
      const wrapper = renderer('ltr')
      await waitImmediate()
      expect(wrapper.find('.ltr').exists()).toBe(true)
    })

    it('should render from right to left', async () => {
      const wrapper = renderer('rtl')
      await waitImmediate()
      expect(wrapper.find('.rtl').exists()).toBe(true)
    })

    it('should render from top to bottom', async () => {
      const wrapper = renderer('ttb')
      await waitImmediate()
      expect(wrapper.find('.ttb').exists()).toBe(true)
    })

    it('should render from bottom to top', async () => {
      const wrapper = renderer('btt')
      await waitImmediate()
      expect(wrapper.find('.btt').exists()).toBe(true)
    })
  })

  it('should close dialog by clicking the close button', async () => {
    const Comp = {
      template: `
        <Drawer :title='title' v-model:visible='visible' :append-to-body='true' :destroy-on-close='true'>
          <span>${content}</span>
        </Drawer>`
    }
    const wrapper = mount(Comp, {
      global: {
        components: {
          Drawer
        }
      },
      data() {
        return {
          title,
          visible: true
        }
      }
    })

    await waitImmediate()
    await wrapper.find('.el-drawer__close-btn').trigger('click')
    expect(wrapper.componentVM.visible).toBe(false)
  })

  it('should not render header when withHeader attribute is false', () => {
    const Comp = {
      template: `
        <Drawer :title='title' v-model:visible='visible' ref='drawer' :with-header='false'>
          <span>${content}</span>
        </Drawer>`
    }
    const wrapper = mount(Comp, {
      global: {
        components: {
          Drawer
        }
      },
      data() {
        return {
          title,
          visible: true
        }
      }
    })

    expect(wrapper.find('.el-drawer__header').exists()).toBe(false)
  })

  it('should invoke before-close', async () => {
    const Comp = {
      template: `
        <Drawer
                :before-close='beforeClose'
                :title='title'
                v-model:visible='visible'
                :append-to-body='true'
                :destroy-on-close='true'
                ref='drawer'
               >
           <span>${content}</span>
        </Drawer>
      `
    }
    const beforeClose = jest.fn()
    const wrapper = mount(Comp, {
      global: {
        components: {
          Drawer
        }
      },
      data() {
        return {
          title,
          visible: true,
          beforeClose
        }
      }
    })

    await waitImmediate()
    wrapper.findComponent({ ref: 'drawer' }).componentVM.closeDrawer()
    await waitImmediate()
    expect(beforeClose).toHaveBeenCalled()
  })

  it('should destroy every child after drawer was closed when destroy-on-close flag is true', async () => {
    const Comp = {
      template: `
        <Drawer :title='title' v-model:visible='visible' :append-to-body='true' :destroy-on-close='true' ref='drawer'>
           <span>${content}</span>
        </Drawer>
      `
    }

    const wrapper = mount(Comp, {
      global: {
        components: {
          Drawer
        }
      },
      data() {
        return {
          title,
          visible: true
        }
      }
    })

    await waitImmediate()
    expect(wrapper.find('.el-drawer__body span').text()).toBe(content)
    wrapper.findComponent({ ref: 'drawer' }).componentVM.closeDrawer()
    await wait(400)
    expect(wrapper.find('.el-drawer__body').exists()).toBe(false)
  })

  it('should have custom classes when custom classes were given', async () => {
    const classes = 'some-custom-class'

    const Comp = {
      template: `
        <Drawer :title='title' v-model:visible='visible' ref='drawer' custom-class='${classes}'>
          <span>${content}</span>
        </Drawer>
      `
    }

    const wrapper = mount(Comp, {
      global: {
        components: {
          Drawer
        }
      },
      data() {
        return {
          title,
          visible: true
        }
      }
    })

    expect(wrapper.find(`.${classes}`).exists()).toBe(true)
  })
})
