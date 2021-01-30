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
import { popperProps, usePopper } from '../../src/composables/popper'
import { useEmitter } from '../../src/composables/emitter'
import {
  onMounted,
  inject,
  ref,
  toRefs,
  getCurrentInstance,
  computed,
  watch,
  reactive
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
  emits: ['update:blur', 'update:modelValue', 'created'],

  setup(props, ctx) {
    const elSelect = inject('select')
    const elms = usePopperElm(elSelect)
    const popper = usePopper(props, ctx, elms)

    usePopperUpdate(() => {
      if (elSelect.visible) {
        popper.updatePopper()
      }
    }, popper.destroyPopper)

    const popperClass = computed(() => {
      return elSelect.popperClass
    })

    const minWidth = useMinWidth(elSelect)

    return {
      elSelect,
      minWidth,
      popperClass,
      ...popper
    }
  }
}

function usePopperElm(elSelect) {
  const { proxy } = getCurrentInstance()
  const elms = reactive({
    referenceElm: null,
    popperElm: null
  })
  onMounted(() => {
    elms.referenceElm = elSelect.$refs.reference.$el
    elSelect.popperElm = elms.popperElm = proxy.$el
  })
  return { ...toRefs(elms) }
}

function usePopperUpdate(updateFn, destroyFn) {
  const { on } = useEmitter()

  onMounted(() => {
    on('updatePopper', updateFn)
    on('destroyPopper', destroyFn)
  })
}

function useMinWidth(elSelect) {
  const minWidth = ref('')

  watch(
    () => elSelect.inputWidth,
    () => {
      minWidth.value = elSelect.$el.getBoundingClientRect().width + 'px'
    }
  )
  return minWidth
}
</script>
