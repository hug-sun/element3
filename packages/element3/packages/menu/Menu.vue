<script>
import {
  computed,
  getCurrentInstance,
  onMounted,
  provide,
  ref,
  toRefs,
  watch
} from 'vue'
import Menubar from '../../src/utils/menu/aria-menubar'
import { useEmitter } from '../../src/composables/emitter'
import { useItems } from './src/menu-use'
import MenuCollapseTransition from './MenuCollapseTransition.vue'

export default {
  name: 'ElMenu',
  componentName: 'ElMenu',
  render() {
    const component = (
      <ul
        role="menubar"
        key={+this.collapse}
        style={{ backgroundColor: this.backgroundColor || '' }}
        class={{
          'el-menu--horizontal': this.mode === 'horizontal',
          'el-menu--collapse': this.collapse,
          'el-menu': true
        }}
      >
        {this.$slots.default()}
      </ul>
    )
    if (this.collapseTransition) {
      return (
        <el-menu-collapse-transition>{component}</el-menu-collapse-transition>
      )
    } else {
      return component
    }
  },
  components: {
    'el-menu-collapse-transition': MenuCollapseTransition
  },

  props: {
    mode: {
      type: String,
      default: 'vertical'
    },
    defaultActive: {
      type: String,
      default: ''
    },
    defaultOpeneds: {
      type: Array,
      default: null
    },
    uniqueOpened: Boolean,
    router: Boolean,
    menuTrigger: {
      type: String,
      default: 'hover'
    },
    collapse: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    textColor: String,
    activeTextColor: String,
    collapseTransition: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'open', 'select', 'on'],
  setup(props, { emit }) {
    const {
      defaultActive,
      defaultOpeneds,
      collapse,
      uniqueOpened,
      backgroundColor,
      mode,
      router
    } = toRefs(props)
    const instance = getCurrentInstance()
    const { broadcast, on } = useEmitter()
    const activeIndex = ref(defaultActive.value)
    const openedMenus = ref(
      defaultOpeneds.value && !collapse.value
        ? defaultOpeneds.value.slice(0)
        : []
    )
    const {
      items,
      itemsInstance,
      submenusInstance,
      addItem,
      removeItem,
      addSubmenu,
      removeSubmenu
    } = useItems()
    const updateActiveIndex = (val) => {
      let item =
        items[val] || items[activeIndex.value] || items[defaultActive.value]
      item = itemsInstance[item]
      if (item) {
        activeIndex.value = item.props.index
        initOpenedMenu()
      } else {
        activeIndex.value = null
      }
    }
    const getColorChannels = (color) => {
      color = color.replace('#', '')
      if (/^[0-9a-fA-F]{3}$/.test(color)) {
        color = color.split('')
        for (let i = 2; i >= 0; i--) {
          color.splice(i, 0, color[i])
        }
        color = color.join('')
      }
      if (/^[0-9a-fA-F]{6}$/.test(color)) {
        return {
          red: parseInt(color.slice(0, 2), 16),
          green: parseInt(color.slice(2, 4), 16),
          blue: parseInt(color.slice(4, 6), 16)
        }
      } else {
        return {
          red: 255,
          green: 255,
          blue: 255
        }
      }
    }
    const mixColor = (color, percent) => {
      let { red, green, blue } = getColorChannels(color)
      if (percent > 0) {
        // shade given color
        red *= 1 - percent
        green *= 1 - percent
        blue *= 1 - percent
      } else {
        // tint given color
        red += (255 - red) * percent
        green += (255 - green) * percent
        blue += (255 - blue) * percent
      }
      return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(
        blue
      )})`
    }
    const openMenu = (index, indexPath) => {
      if (openedMenus.value.indexOf(index) !== -1) return
      // 将不在该菜单路径下的其余菜单收起
      // collapse all menu that are not under current menu item
      if (uniqueOpened.value) {
        openedMenus.value = openedMenus.value.filter((index) => {
          return indexPath.indexOf(index) !== -1
        })
      }
      openedMenus.value.push(index)
    }
    const closeMenu = (index) => {
      const i = openedMenus.value.indexOf(index)
      if (i !== -1) {
        openedMenus.value.splice(i, 1)
      }
    }
    const handleSubmenuClick = (submenu) => {
      const { index, indexPath } = submenu.proxy
      const isOpened = openedMenus.value.indexOf(index) !== -1
      if (isOpened) {
        closeMenu(index)
        emit('close', index, indexPath)
      } else {
        openMenu(index, indexPath)
        emit('open', index, indexPath)
      }
    }
    const handleItemClick = (item) => {
      const { index, indexPath } = item.proxy
      const oldActiveIndex = activeIndex.value
      const hasIndex = index !== null
      if (hasIndex) {
        activeIndex.value = index
      }
      emit('select', index, indexPath, item)
      if (mode.value === 'horizontal' || collapse.value) {
        openedMenus.value.length = 0
      }
      if (router.value && hasIndex) {
        routeToItem(item, (error) => {
          activeIndex.value = oldActiveIndex
          if (error) {
            // vue-router 3.1.0+ push/replace cause NavigationDuplicated error
            // https://github.com/ElemeFE/element/issues/17044
            if (error.name === 'NavigationDuplicated') return
            console.error(error)
          }
        })
      }
    }
    const initOpenedMenu = () => {
      const index = activeIndex.value
      const activeItem = itemsInstance[index]
      if (!activeItem || mode.value === 'horizontal' || collapse.value) return
      const indexPath = activeItem.setupState.indexPath
      // 展开该菜单项的路径上所有子菜单
      // expand all submenus of the menu item
      indexPath.forEach((index) => {
        const submenu = submenusInstance[index]
        submenu && openMenu(index, submenu.setupState.indexPath)
      })
    }
    const routeToItem = (item, onError) => {
      const route = item.proxy.route || item.proxy.index
      try {
        instance.proxy.$router.push(route, () => {}, onError)
      } catch (e) {
        console.error(e)
      }
    }
    const open = (index) => {
      const { indexPath } = submenusInstance[index.toString()]
      indexPath.forEach((i) => openMenu(i, indexPath))
    }
    const close = (index) => {
      closeMenu(index)
    }
    const hoverBackground = computed(() => {
      return backgroundColor.value ? mixColor(backgroundColor.value, 0.2) : ''
    })
    const isMenuPopup = computed(() => {
      return (
        mode.value === 'horizontal' ||
        (mode.value === 'vertical' && collapse.value)
      )
    })
    watch(defaultActive, (value) => {
      if (!items[value]) {
        activeIndex.value = null
      }
      updateActiveIndex(value)
    })
    watch(defaultOpeneds, (value) => {
      if (!collapse.value) {
        openedMenus.value = value
      }
    })
    watch(collapse, (value) => {
      if (value) openedMenus.value = []
      broadcast('toggle-collapse', value)
    })
    onMounted(() => {
      initOpenedMenu()
      on('item-click', handleItemClick)
      on('submenu-click', handleSubmenuClick)
      if (mode.value === 'horizontal') {
        new Menubar(instance.vnode.el)
      }
      watch(items, updateActiveIndex)
    })
    provide('rootMenu', instance)
    return {
      addItem,
      removeItem,
      addSubmenu,
      removeSubmenu,
      openedMenus,
      activeIndex,
      hoverBackground,
      isMenuPopup,
      openMenu,
      closeMenu,
      open,
      close
    }
  }
}
</script>
