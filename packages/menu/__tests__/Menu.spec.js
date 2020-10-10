import Menu from '../Menu.vue'
import MenuItem from '../MenuItem.vue'
import Submenu from '../Submenu.vue'
import MenuItemGroup from '../MenuItemGroup.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const components = {
  ElMenu: Menu,
  ElMenuItem: MenuItem
}

const components2 = {
  ElMenu: Menu,
  ElMenuItem: MenuItem,
  ElSubmenu: Submenu
}

describe('Menu.vue', () => {
  it('create', async () => {
    const Comp = {
      template: `
        <el-menu>
          <el-menu-item index="1" >处理中心</el-menu-item>
          <el-menu-item index="2" >订单管理</el-menu-item>
        </el-menu>
      `,
      components
    }

    const wrapper = mount(Comp)
    const item1 = wrapper.findAllComponents(MenuItem)[0]
    const item2 = wrapper.findAllComponents(MenuItem)[1]
    await item1.trigger('click')
    expect(item1.classes()).toContain('is-active')
    await item2.trigger('click')
    expect(item2.classes()).toContain('is-active')
  })

  it('background-color', async () => {
    const Comp = {
      template: `
        <el-menu default-active="2"
          background-color="#f00"
          text-color="#000"
          active-text-color="#0f0">
          <el-menu-item index="1" ref="item1">处理中心</el-menu-item>
          <el-menu-item index="2" ref="item2">订单管理</el-menu-item>
        </el-menu>
      `,
      components
    }

    const wrapper = mount(Comp)
    const item1 = wrapper.findAllComponents(MenuItem)[0]
    const item2 = wrapper.findAllComponents(MenuItem)[1]
    // expect(wrapper.attributes().style).toContain('rgb(255, 0, 0)')
    expect(item1.attributes().style).toContain('rgb(255, 0, 0)')
    expect(item1.attributes().style).toContain('rgb(0, 0, 0)')
    expect(item2.attributes().style).toContain('rgb(0, 255, 0)')
    await item1.trigger('mouseenter')
    expect(item1.attributes().style).toContain('rgb(204, 0, 0)')
  })

  it('menu-item click', async () => {
    const Comp = {
      template: `
        <el-menu>
          <el-menu-item @click="onMenuItemClick" index="1" ref="item1">处理中心</el-menu-item>
          <el-menu-item index="2" ref="item2">订单管理</el-menu-item>
        </el-menu>
      `,
      components,
      methods: {
        onMenuItemClick() {
          this.clicksCount = this.clicksCount + 1
        }
      },
      data() {
        return {
          clicksCount: 0
        }
      }
    }

    const wrapper = mount(Comp)
    const item1 = wrapper.findAllComponents(MenuItem)[0]
    item1.trigger('click')
    await nextTick()
    expect(wrapper.componentVM.clicksCount).toBe(1)
  })

  it('menu-item disabled', async () => {
    const Comp = {
      template: `
    <el-menu default-active="2">
      <el-menu-item index="1" ref="item1" disabled>处理中心</el-menu-item>
      <el-menu-item index="2" ref="item2">订单管理</el-menu-item>
    </el-menu>
  `,
      components
    }

    const wrapper = mount(Comp)
    const item1 = wrapper.findAllComponents(MenuItem)[0]
    const item2 = wrapper.findAllComponents(MenuItem)[1]
    expect(item2.classes()).toContain('is-active')
    await item1.trigger('click')
    expect(item1.classes('is-active')).toBe(false)
  })

  describe('default active', () => {
    it('normal active', async () => {
      const Comp = {
        template: `
        <el-menu default-active="2">
          <el-menu-item index="1" ref="item1">处理中心</el-menu-item>
          <el-menu-item index="2" ref="item2">订单管理</el-menu-item>
        </el-menu>
      `,
        components
      }

      const wrapper = mount(Comp)
      const item1 = wrapper.findAllComponents(MenuItem)[0]
      const item2 = wrapper.findAllComponents(MenuItem)[1]
      expect(item2.classes()).toContain('is-active')
      await item1.trigger('click')
      expect(item1.classes()).toContain('is-active')
    })

    // it('dynamic active', async () => {
    //   const Comp = {
    //     template: `
    //     <el-menu >
    //       <el-menu-item index="1" ref="item1">active watch处理中心</el-menu-item>
    //       <el-menu-item index="2" ref="item2">active watch订单管理</el-menu-item>
    //     </el-menu>
    //   `,
    //     components
    //   }

    //   const wrapper = mount(Comp, {
    //     props: {
    //       defaultActive: '2'
    //     }
    //   })
    //   const item1 = wrapper.findAllComponents(MenuItem)[0]
    //   await wrapper.setProps({ defaultActive: '1' })
    //   expect(item1.classes()).toContain('is-active')
    // })

    it('vertical submenu item active', async () => {
      const Comp = {
        template: `
            <div>
              <el-menu default-active="2-2">
                <el-menu-item index="1" ref="item1">处理中心</el-menu-item>
                <el-submenu index="2" ref="submenu">
                  <template slot="title">我的工作台</template>
                  <el-menu-item index="2-1">选项1</el-menu-item>
                  <el-menu-item index="2-2" ref="submenuItem2">选项2</el-menu-item>
                  <el-menu-item index="2-3">选项3</el-menu-item>
                </el-submenu>
                <el-menu-item index="3">订单管理</el-menu-item>
              </el-menu>
            </div>
          `,
        components: components2
      }

      const wrapper = mount(Comp)
      const submenu = wrapper.findComponent(Submenu)
      const submenuItem2 = wrapper
        .findComponent(Submenu)
        .findAllComponents(MenuItem)[1]
      expect(submenuItem2.classes()).toContain('is-active')
      await nextTick()
      expect(submenu.classes()).toContain('is-opened')
      expect(submenu.classes()).toContain('is-active')
    })

    it('horizontal submenu item active', async () => {
      const Comp = {
        template: `
            <div>
              <el-menu default-active="2-2">
                <el-menu-item index="1" ref="item1">处理中心</el-menu-item>
                <el-submenu index="2" ref="submenu">
                  <template slot="title">我的工作台</template>
                  <el-menu-item index="2-1">选项1</el-menu-item>
                  <el-menu-item index="2-2" ref="submenuItem2">选项2</el-menu-item>
                  <el-menu-item index="2-3">选项3</el-menu-item>
                </el-submenu>
                <el-menu-item index="3">订单管理</el-menu-item>
              </el-menu>
            </div>
          `,
        components: components2
      }

      const wrapper = mount(Comp)
      const submenu = wrapper.findComponent(Submenu)
      const submenuItem2 = wrapper
        .findComponent(Submenu)
        .findAllComponents(MenuItem)[1]
      expect(submenuItem2.classes()).toContain('is-active')
      await nextTick()
      expect(submenu.classes()).toContain('is-opened')
      expect(submenu.classes()).toContain('is-active')
    })
  })

  describe('submenu', () => {
    it('toggle', async () => {
      const Comp = {
        template: `
          <el-menu>
            <el-menu-item index="1" ref="item1">处理中心</el-menu-item>
            <el-submenu index="2" ref="submenu">
              <template slot="title">我的工作台</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2" ref="submenuItem2">选项2</el-menu-item>
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-submenu>
            <el-menu-item index="3">订单管理</el-menu-item>
          </el-menu>
        `,
        components: components2
      }
      const wrapper = mount(Comp)
      const submenu = wrapper.findComponent(Submenu)
      const submenuItem2 = wrapper
        .findComponent(Submenu)
        .findAllComponents(MenuItem)[1]
      submenu.find('.el-submenu__title').trigger('click')
      await nextTick()
      expect(submenu.classes()).toContain('is-opened')
      submenuItem2.trigger('click')
      await nextTick()
      // expect(submenuItem2.classes()).toContain('is-active')
      submenu.find('.el-submenu__title').trigger('click')
      expect(submenu.classes()).toContain('is-opened')
    })

    // it('default opened', async () => {
    //   const Comp = {
    //     template: `
    //     <el-menu >
    //       <el-menu-item index="1">default opened处理中心</el-menu-item>
    //       <el-submenu index="2" ref="submenu1">
    //         <template slot="title">default opened我的工作台</template>
    //         <el-menu-item index="2-1">选项1</el-menu-item>
    //         <el-menu-item index="2-2" ref="submenu1Item2">选项2</el-menu-item>
    //         <el-menu-item index="2-3">选项3</el-menu-item>
    //       </el-submenu>
    //       <el-submenu index="3" ref="submenu2">
    //         <template slot="title">default opened订单管理</template>
    //         <el-menu-item index="3-1">选项1</el-menu-item>
    //         <el-menu-item index="3-2" ref="submenu2Item2">选项2</el-menu-item>
    //         <el-menu-item index="3-3">选项3</el-menu-item>
    //       </el-submenu>
    //     </el-menu>
    //   `,
    //     data() {
    //       return {
    //         defaultOpeneds: ['2', '3']
    //       }
    //     },
    //     components: components2
    //   }
    //   const wrapper = mount(Comp)
    //   const submenu1 = wrapper.findAllComponents(Submenu)[0]
    //   const submenu2 = wrapper.findAllComponents(Submenu)[1]
    //    expect(submenu1.classes('is-opened')).toBe(true)
    //   expect(submenu2.classes('is-opened')).toBe(true)
    // })

    it('disabled', async () => {
      const Comp = {
        template: `
          <el-menu>
            <el-menu-item index="1" ref="item1">处理中心</el-menu-item>
            <el-submenu index="2" ref="submenu" disabled>
              <template slot="title">我的工作台</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2" ref="submenuItem2">选项2</el-menu-item>
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-submenu>
            <el-menu-item index="3">订单管理</el-menu-item>
          </el-menu>
        `,
        components: components2
      }
      const wrapper = mount(Comp)
      const submenu = wrapper.findComponent(Submenu)
      submenu.find('.el-submenu__title').trigger('click')
      await nextTick()
      expect(submenu.classes('is-opened')).toBe(false)
    })

    it('unique-opened', async () => {
      const Comp = {
        template: `
        <el-menu unique-opened default-active="2-2">
          <el-menu-item index="1">处理中心</el-menu-item>
          <el-submenu index="2" ref="submenu1">
            <template slot="title">我的工作台</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2" ref="submenu1Item2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
          </el-submenu>
          <el-submenu index="3" ref="submenu2">
            <template slot="title">订单管理</template>
            <el-menu-item index="3-1">选项1</el-menu-item>
            <el-menu-item index="3-2" ref="submenu2Item2">选项2</el-menu-item>
            <el-menu-item index="3-3">选项3</el-menu-item>
          </el-submenu>
        </el-menu>
      `,
        components: components2
      }
      const wrapper = mount(Comp)
      const submenu1 = wrapper.findAllComponents(Submenu)[0]
      const submenu2 = wrapper.findAllComponents(Submenu)[1]
      submenu2.find('.el-submenu__title').trigger('click')
      await nextTick()
      expect(submenu1.classes('is-opened')).toBe(false)
    })

    // it('horizontal mode', async () => {
    //   const Comp = {
    //     template: `
    //     <el-menu mode="horizontal">
    //       <el-menu-item index="1">处理中心</el-menu-item>
    //       <el-submenu index="2" ref="submenu">
    //         <template slot="title">我的工作台</template>
    //         <el-menu-item index="2-1">选项1</el-menu-item>
    //         <el-menu-item index="2-2" ref="submenuItem2">选项2</el-menu-item>
    //         <el-menu-item index="2-3">选项3</el-menu-item>
    //       </el-submenu>
    //       <el-menu-item index="3">订单管理</el-menu-item>
    //     </el-menu>
    //   `,
    //     components: components2
    //   }
    //   const wrapper = mount(Comp, {
    //     attachTo: document.body
    //   })
    //   expect(wrapper.classes()).toContain('el-menu--horizontal')
    // })

    it('menu group', () => {
      const Comp = {
        template: `
        <el-menu mode="vertical" default-active="1">
          <el-menu-item-group title="分组一" ref="group1">
            <el-menu-item index="1"><i class="el-icon-message"></i>导航一</el-menu-item>
            <el-menu-item index="2"><i class="el-icon-message"></i>导航二</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="5">
            <template slot="title">导航五</template>
            <el-menu-item-group title="分组二">
              <el-menu-item index="5-1">选项1</el-menu-item>
              <el-menu-item index="5-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      `,
        components: {
          ElMenu: Menu,
          ElMenuItem: MenuItem,
          ElSubmenu: Submenu,
          ElMenuItemGroup: MenuItemGroup
        }
      }
      const wrapper = mount(Comp)
      const group1 = wrapper.findAllComponents(MenuItemGroup)[0]
      expect(group1.find('.el-menu-item-group__title').text()).toContain(
        '分组一'
      )
    })

    it('dynamic menus, issue 9092', async () => {
      const Comp = {
        template: `
        <el-menu >
          <el-menu-item
            v-for="menu in menus"
            :index="menu.name"
            :key="menu.name">
            {{menu.description}}
          </el-menu-item>
        </el-menu>
      `,
        data() {
          return {
            menus: [
              { name: '1', description: 'happy' },
              { name: '2', description: 'new' },
              { name: '3', description: 'year' }
            ]
          }
        },
        components
      }
      const wrapper = mount(Comp, {
        props: { defaultActive: '2' }
      })
      expect(wrapper.find('.el-menu-item.is-active').text()).toContain('new')
      await wrapper.setProps({ defaultActive: '3' })
      expect(wrapper.find('.el-menu-item.is-active').text()).toContain('year')
    })
  })
})
