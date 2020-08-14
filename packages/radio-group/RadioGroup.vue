<template @change="test">
  <component
    :is="elTag"
    class="el-radio-group"
    role="radiogroup"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </component>
</template>
<script>
import { useEmitter } from 'element-ui/src/use/emitter'
import { getCurrentInstance, onMounted, watch, toRefs, computed, inject, provide } from 'vue'

const keyCode = Object.freeze({
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
})

export default {
  name: 'ElRadioGroup',

  props: {
    modelValue: [String, Number, Symbol, Boolean],
    size: String,
    fill: String,
    textColor: String,
    disabled: Boolean
  },

  emits: ['update:modelValue', 'change'],

  setup(props) {
    const { modelValue: modelValueRef = {}, size: sizeRef = {} } = toRefs(props)
    const { dispatch } = useEmitter()

    const elFormItem = inject('elFormItem', { ctx: {} })

    provide('elRadioGroup', getCurrentInstance());

    watch(modelValueRef, (v) => {
      dispatch('ElFormItem', 'el.form.change', [v])
    })

    const { handleKeydown } = useKeyDown()

    const { elTagRef, radioGroupSizeRef } = useStyle({ elFormItem, sizeRef })

    return {
      elTag: elTagRef,
      radioGroupSize: radioGroupSizeRef,
      handleKeydown
    }
  }
}

function useKeyDown() {
  const { ctx } = getCurrentInstance()
  onMounted(() => {
    const radios = ctx.$el.querySelectorAll('[type=radio]')
    const firstLabel = ctx.$el.querySelectorAll('[role=radio]')[0]
    if (![].some.call(radios, (radio) => radio.checked) && firstLabel) {
      firstLabel.tabIndex = 0
    }
  })

  function handleKeydown(e) {
    const target = e.target
    const className =
      target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]'
    const radios = ctx.$el.querySelectorAll(className)
    const length = radios.length
    const index = [].indexOf.call(radios, target)
    const roleRadios = ctx.$el.querySelectorAll('[role=radio]')
    switch (e.keyCode) {
      case keyCode.LEFT:
      case keyCode.UP:
        e.stopPropagation()
        e.preventDefault()
        if (index === 0) {
          roleRadios[length - 1].click()
          roleRadios[length - 1].focus()
        } else {
          roleRadios[index - 1].click()
          roleRadios[index - 1].focus()
        }
        break
      case keyCode.RIGHT:
      case keyCode.DOWN:
        if (index === length - 1) {
          e.stopPropagation()
          e.preventDefault()
          roleRadios[0].click()
          roleRadios[0].focus()
        } else {
          roleRadios[index + 1].click()
          roleRadios[index + 1].focus()
        }
        break
      default:
        break
    }
  }

  return { handleKeydown }
}

function useStyle({ elFormItem, sizeRef }) {
  const { ctx, vnode } = getCurrentInstance()

  const radioGroupSizeRef = computed(() => {
    return (
      sizeRef.value ||
      elFormItem.ctx.elFormItemSize ||
      (ctx.$ELEMENT || {}).size
    )
  })

  const elTagRef = computed(() => {
    return (vnode.data || {}).tag || 'div'
  })

  return { radioGroupSizeRef, elTagRef }
}
</script>
