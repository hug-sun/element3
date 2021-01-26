<template>
  <li
    class="el-dropdown-menu__item"
    :class="{
      'is-disabled': disabled,
      'el-dropdown-menu__item--divided': divided
    }"
    @click="handleClick"
    :aria-disabled="disabled"
    :tabindex="disabled ? null : -1"
  >
    <i :class="icon" v-if="icon"></i>
    <slot></slot>
  </li>
</template>
<script>
import { toRefs, getCurrentInstance } from 'vue'
import { useEmitter } from '../../../src/composables/emitter'

export default {
  name: 'ElDropdownItem',

  props: {
    command: {},
    disabled: Boolean,
    divided: Boolean,
    icon: String
  },

  setup(props) {
    const instance = getCurrentInstance()
    const { dispatch } = useEmitter(instance)
    const { command } = toRefs(props)

    const handleClick = () => {
      dispatch('menu-item-click', command?.value, instance.proxy)
    }

    return {
      handleClick
    }
  }
}
</script>
