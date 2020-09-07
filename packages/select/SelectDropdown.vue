<template>
  <div
    class="el-select-dropdown el-popper"
    :class="[{ 'is-multiple': elSelect.multiple }, popperClass]"
    :style="{ minWidth: minWidth }"
  >
    <slot></slot>
  </div>
</template>

<script type="text/babel">
import { popperProps, usePopper } from 'element-ui/src/use/popper'
import { useEmitter } from 'element-ui/src/use/emitter'
import {
  onMounted,
  inject,
  ref,
  getCurrentInstance,
  computed,
  watch
} from 'vue'

export default {
  name: 'ElSelectDropdown',

  componentName: 'ElSelectDropdown',

  props: {
    ...popperProps,
    placement: {
      default: 'bottom-start'
    },

    boundariesPadding: {
      default: 0
    },

    popperOptions: {
      default() {
        return {
          gpuAcceleration: false
        }
      }
    },

    visibleArrow: {
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: true
    }
  },

  setup(props, { slots, emit }) {
    const { on } = useEmitter()
    const { ctx } = getCurrentInstance()
    const elSelect = inject('select')

    const referenceElm = ref(null)
    const popperElm = ref(null)

    const popper = usePopper(props, {
      slots,
      emit,
      referenceElm
    })

    onMounted(() => {
      referenceElm.value = elSelect.$refs.reference.$el
      elSelect.popperElm = popperElm.value = ctx.$el
      on('updatePopper', () => {
        console.log('updatePopper')

        if (elSelect.visible) popper.updatePopper()
      })
      on('destroyPopper', () => {
        console.log('destroyPopper')

        popper.destroyPopper()
      })
    })

    const minWidth = ref('')

    watch(
      () => elSelect.inputWidth,
      () => {
        minWidth.value = elSelect.$el.getBoundingClientRect().width + 'px'
      }
    )

    const popperClass = computed(() => {
      return elSelect.popperClass
    })

    return {
      elSelect,
      referenceElm,
      minWidth,
      popperClass,
      ...popper
    }
  }
}
</script>
