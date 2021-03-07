import { mount } from '@vue/test-utils'
import ElMenu from '../Menu.vue'
import ElSubmenu from '../Submenu.vue'
import ElMenuItem from '../MenuItem.vue'
describe('Menu', () => {
  it.todo('base test')

  it("Unable to expand child after setting 'unique-opened' attribute on ElMenu Component #572", async () => {
    const wrapper = mount({
      template: `
        <el-menu uniqueOpened>
          <el-submenu index="1">
            <template v-slot:title>A</template>
            <el-menu-item index="1-1">A-1</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template v-slot:title>B</template>
            <el-menu-item index="2-1">B-1</el-menu-item>
          </el-submenu>
        </el-menu>
      `,
      components: {
        ElMenu,
        ElSubmenu,
        ElMenuItem
      }
    })

    const submenus = wrapper.findAll('.el-submenu__title')

    await submenus[0].trigger('click')
    await submenus[1].trigger('click')

    expect(wrapper.findAll('.is-opened')).toHaveLength(1)
  })
})
