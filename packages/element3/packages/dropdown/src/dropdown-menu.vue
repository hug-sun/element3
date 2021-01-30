<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <ul
      class="el-dropdown-menu el-popper"
      :class="[size && `el-dropdown-menu--${size}`]"
      v-show="showPopper"
    >
      <slot></slot>
    </ul>
  </transition>
</template>
<script>
import {
  ref,
  watch,
  inject,
  getCurrentInstance,
  onMounted,
  nextTick
} from 'vue'
import { usePopper, popperProps } from '../../../src/composables/popper'
import { useEmitter } from '../../../src/composables/emitter'

export default {
  name: 'ElDropdownMenu',

  componentName: 'ElDropdownMenu',

  props: {
    ...popperProps,
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: {
      type: Number,
      default: 0
    }
  },

  emits: ['updatePopper', 'visible', 'update:modelValue', 'created'],

  setup(props, { emit, slots }) {
    const popperElm = ref(null)
    const referenceElm = ref(null)
    const { doDestroy, showPopper, currentPlacement, updatePopper } = usePopper(
      props,
      {
        emit,
        slots
      },
      {
        popperElm,
        referenceElm
      }
    )
    const dropdown = inject('dropdown')
    const size = dropdown.dropdownSize
    const instance = getCurrentInstance()

    const { on } = useEmitter(instance)
    on('updatePopper', () => {
      if (showPopper.value) updatePopper()
    })

    on('visible', (val) => {
      showPopper.value = val
    })

    onMounted(() => {
      dropdown.popperElm = popperElm.value = instance.proxy.$el
      referenceElm.value = dropdown.$el

      nextTick(() => dropdown.initDomOperation())
    })

    watch(
      () => dropdown.placement,
      (val) => {
        currentPlacement.value = val
      },
      { immediate: true }
    )

    watch(
      () => dropdown.visible.value,
      (val) => {
        showPopper.value = val
      }
    )

    return {
      showPopper,
      size,
      doDestroy
    }
  }
}
</script>
