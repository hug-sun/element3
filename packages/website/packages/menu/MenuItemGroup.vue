<template>
  <li class="el-menu-item-group">
    <div
      class="el-menu-item-group__title"
      :style="{ paddingLeft: levelPadding + 'px' }"
    >
      <template v-if="!$slots.title">{{ title }}</template>
      <slot v-else name="title"></slot>
    </div>
    <ul>
      <slot></slot>
    </ul>
  </li>
</template>
<script>
import { computed, getCurrentInstance, inject } from 'vue'
export default {
  name: 'ElMenuItemGroup',

  componentName: 'ElMenuItemGroup',

  props: {
    title: {
      type: String
    }
  },
  setup() {
    const instance = getCurrentInstance()
    const rootMenu = inject('rootMenu')
    const levelPadding = computed(() => {
      let padding = 20
      let parent = instance.parent
      if (rootMenu.props.collapse) return 20
      while (parent && parent.type.name !== 'ElMenu') {
        if (parent.type.name === 'ElSubmenu') {
          padding += 20
        }
        parent = parent.parent
      }
      return padding
    })
    return {
      levelPadding
    }
  }
}
</script>
