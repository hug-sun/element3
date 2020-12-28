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
import { useEmitter } from '../../src/use/emitter'
import {
  getCurrentInstance,
  onMounted,
  watch,
  toRefs,
  computed,
  inject
} from 'vue'
const keyCode = Object.freeze({
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
})

export default {
  name: 'ElRadioGroup',

  componentName: 'ElRadioGroup',

  props: {
    modelValue: [String, Number, Symbol, Boolean],
    size: String,
    fill: String,
    textColor: String,
    disabled: Boolean
  },

  emits: ['update:modelValue', 'change'],

  setup(props) {
    const { modelValue = {}, size = {} } = toRefs(props)
    const { dispatch } = useEmitter()
    const { elFormItem } = useInject()

    watch(modelValue, (v) => {
      dispatch('el.form.change', v)
    })

    const { handleKeydown } = useKeyDown()

    const { elTag, radioGroupSize } = useStyle({ elFormItem, size })

    return {
      elTag,
      radioGroupSize,
      handleKeydown
    }
  }
}

function useInject() {
  const elFormItem = inject('elFormItem', {})
  return {
    elFormItem
  }
}

function useKeyDown() {
  const { proxy } = getCurrentInstance()
  onMounted(() => {
    const radios = proxy.$el.querySelectorAll('[type=radio]')
    const firstLabel = proxy.$el.querySelectorAll('[role=radio]')[0]
    if (![].some.call(radios, (radio) => radio.checked) && firstLabel) {
      firstLabel.tabIndex = 0
    }
  })

  function handleKeydown(e) {
    const target = e.target
    const className =
      target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]'
    const radios = proxy.$el.querySelectorAll(className)
    const length = radios.length
    const index = [].indexOf.call(radios, target)
    const roleRadios = proxy.$el.querySelectorAll('[role=radio]')
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

function useStyle({ elFormItem, size }) {
  const { proxy, vnode } = getCurrentInstance()

  const radioGroupSize = computed(() => {
    return (
      size.value || elFormItem.elFormItemSize || (proxy.$ELEMENT || {}).size
    )
  })

  const elTag = computed(() => {
    return (vnode.data || {}).tag || 'div'
  })

  return { radioGroupSize, elTag }
}
</script>
