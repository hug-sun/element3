import { getCurrentInstance, inject, computed, reactive } from 'vue'
function useMenu(index) {
  const Instance = getCurrentInstance()
  const rootMenu = inject('rootMenu')
  const parent = Instance.parent
  const indexPath = computed(() => {
    const path = [index]
    let p = parent
    while (p.type.name !== 'ElMenu') {
      if (p.props.index) {
        path.unshift(p.props.index)
      }
      p = p.parent
    }
    return path
  })
  const parentMenu = computed(() => {
    let p = parent
    while (p && ['ElMenu', 'ElSubmenu'].indexOf(p.type.name) === -1) {
      p = p.parent
    }
    return p
  })
  const paddingStyle = computed(() => {
    if (rootMenu.props.mode !== 'vertical') return {}
    let padding = 20
    let p = parent
    if (rootMenu.props.collapse) {
      padding = 20
    } else {
      while (p && p.type.name !== 'ElMenu') {
        if (p.type.name === 'ElSubmenu') {
          padding += 20
        }
        p = p.parent
      }
    }
    return { paddingLeft: padding + 'px' }
  })
  return {
    indexPath,
    parentMenu,
    paddingStyle,
    rootMenu
  }
}
function useItems() {
  const items = reactive({})
  const itemsInstance = {}
  const submenus = reactive({})
  const submenusInstance = {}
  const addItem = (item) => {
    let index = item.props.index
    items[index] = index
    itemsInstance[index] = item
  }
  const removeItem = (item) => {
    let index = item.props.index
    delete items[index]
    delete itemsInstance[index]
  }
  const addSubmenu = (item) => {
    let index = item.props.index
    submenus[index] = index
    submenusInstance[index] = item
  }
  const removeSubmenu = (item) => {
    let index = item.props.index
    delete submenus[index]
    delete submenusInstance[index]
  }

  return {
    items,
    itemsInstance,
    submenus,
    submenusInstance,
    addItem,
    removeItem,
    addSubmenu,
    removeSubmenu
  }
}
export { useMenu, useItems }
