import Drawer from '../Drawer.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const title = '我是测试 title'
const content = 'content'

describe('Drawer.vue', () => {
  it('create', async () => {
    const wrapper = mount(Drawer, {
      props: {
        title: 'title',
        visible: true
      }
    })
    expect(wrapper.find('.el-drawer__header').text()).toBe('title')
    expect(wrapper.find('.el-drawer').attributes().style).not.toBe('none')
  })

  it('should destroy every child after drawer was closed when destroy-on-close flag is true', async () => {
    const Comp = {
      template: `
          <Drawer :title='title' :visible='visible' :append-to-body='true' :destroy-on-close='true' ref='drawer'>
             <span>${content}</span>
          </Drawer>
        `,
      data() {
        return {
          title,
          visible: true
        }
      },
      components: { Drawer }
    }

    const wrapper = mount(Comp)
    await nextTick()
    expect(wrapper.find('.el-drawer__body span').text()).toBe(content)
    const drawer = wrapper.findComponent({ name: 'ElDrawer' })
    drawer.componentVM.closeDrawer()
    await nextTick()
    expect(wrapper.find('.el-drawer__body').exists()).toBe(false)
  })

  it('should close dialog by clicking the close button', async () => {
    const Comp = {
      template: `
          <Drawer :title='title' :visible.sync='visible' :append-to-body='true' :destroy-on-close='true' ref='drawer'>
             <span>${content}</span>
          </Drawer>
        `,
      data() {
        return {
          title,
          visible: true
        }
      },
      components: { Drawer }
    }

    const wrapper = mount(Comp)
    await nextTick()
    const drawer = wrapper.findComponent({ name: 'ElDrawer' })
    await drawer.find('.el-drawer__close-btn').trigger('click')
    expect(drawer.componentVM.visible).toBe(true)
  })

  it('should invoke before-close', async () => {
    const beforeClose = jest.fn()
    const Comp = {
      template: `
        <Drawer
                :before-close='beforeClose'
                :title='title'
                :visible.sync='visible'
                :append-to-body='true'
                :destroy-on-close='true'
                ref='drawer'
               >
           <span>${content}</span>
        </Drawer>
      `,
      data() {
        return {
          title,
          visible: true,
          beforeClose
        }
      },
      components: { Drawer }
    }

    const wrapper = mount(Comp)
    const drawer = wrapper.findComponent({ name: 'ElDrawer' })
    await drawer.componentVM.closeDrawer()
    expect(beforeClose).toHaveBeenCalled()
  })

  it('should not show close button when show-close flag is false', async () => {
    const Comp = {
      template: `
          <Drawer :title='title' :visible='visible' ref='drawer' :show-close='false'>
             <span>${content}</span>
          </Drawer>
        `,
      data() {
        return {
          title,
          visible: false
        }
      },
      components: { Drawer }
    }
    const wrapper = mount(Comp)
    expect(wrapper.find('.el-drawer__close-btn').exists()).toBe(false)
  })

  it('should have custom classes when custom classes were given', async () => {
    const classes = 'some-custom-class'
    const Comp = {
      template: `
          <Drawer :title='title' :visible='visible' ref='drawer' custom-class='${classes}'>
             <span>${content}</span>
          </Drawer>
        `,
      data() {
        return {
          title,
          visible: false
        }
      },
      components: { Drawer }
    }
    const wrapper = mount(Comp)
    expect(wrapper.find(`.${classes}`).exists()).toBe(true)
  })

  it('should not render header when withHeader attribute is false', () => {
    const Comp = {
      template: `
          <Drawer :title='title' :visible='visible' ref='drawer' :with-header='false'>
             <span>${content}</span>
          </Drawer>
        `,
      data() {
        return {
          title,
          visible: true
        }
      },
      components: { Drawer }
    }
    const wrapper = mount(Comp)
    expect(wrapper.find('.el-drawer__header').exists()).toBe(false)
  })

  describe('directions', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        title,
        direction: 'ltr'
      }
    })
    it('should render from left to right', async () => {
      await nextTick()
      expect(wrapper.find('.ltr').exists()).toBe(true)
    })

    it('should render from right to left', async () => {
      await wrapper.setProps({ direction: 'rtl' })
      expect(wrapper.find('.rtl').exists()).toBe(true)
    })

    it('should render from top to bottom', async () => {
      await wrapper.setProps({ direction: 'ttb' })
      expect(wrapper.find('.ttb').exists()).toBe(true)
    })

    it('should render from bottom to top', async () => {
      await wrapper.setProps({ direction: 'btt' })
      expect(wrapper.find('.btt').exists()).toBe(true)
    })
  })

  describe('size', () => {
    const wrapper = mount(Drawer, {
      props: {
        visible: true,
        title,
        direction: 'ltr',
        size: '50%'
      }
    })

    it('should effect height when drawer is vertical', async () => {
      expect(wrapper.find('.el-drawer').attributes().style).toBe('width: 50%;')
    })

    it('should effect width when drawer is horizontal', async () => {
      await wrapper.setProps({ direction: 'ttb' })
      expect(wrapper.find('.el-drawer').attributes().style).toBe('height: 50%;')
    })
  })
})
