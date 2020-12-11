<template>
  <label
    class="el-radio-button"
    :class="[
      size ? 'el-radio-button--' + size : '',
      { 'is-active': value === label },
      { 'is-disabled': isDisabled },
      { 'is-focus': focus }
    ]"
    role="radio"
    :aria-checked="value === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="value = isDisabled ? value : label"
  >
    <input
      class="el-radio-button__orig-radio"
      :value="label"
      type="radio"
      v-model="value"
      :name="name"
      @change="handleChange"
      :disabled="isDisabled"
      tabindex="-1"
      @focus="focus = true"
      @blur="focus = false"
    />
    <span
      class="el-radio-button__inner"
      :style="value === label ? activeStyle : null"
      @keydown.stop
    >
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
import {
  toRefs,
  ref,
  inject,
  getCurrentInstance,
  computed,
  nextTick
} from 'vue'

export default {
  name: 'ElRadioButton',

  componentName: 'ElRadioButton',

  props: {
    label: [String, Number, Symbol, Boolean],
    disabled: Boolean,
    name: String
  },

  setup(props) {
    const { label, disabled } = toRefs(props)
    const radio = ref()
    const focus = ref(false)

    const { elForm, elFormItem } = useInject()

    const { radioGroup } = useCheckGroup()

    const { value, handleChange } = useModel({ radioGroup, label, radio })

    const { size, isDisabled, tabIndex, activeStyle } = useStyle({
      radioGroup,
      disabled,
      value,
      label,
      elForm,
      elFormItem
    })

    return {
      radio,
      focus,
      value,
      size,
      isDisabled,
      tabIndex,
      activeStyle,
      handleChange
    }
  }
}

function useInject() {
  const elForm = inject('elForm', {})
  const elFormItem = inject('elFormItem', {})
  return {
    elForm,
    elFormItem
  }
}

function useCheckGroup() {
  let { parent } = getCurrentInstance()
  while (parent) {
    if (parent.type.name !== 'ElRadioGroup') {
      parent = parent.parent
    } else {
      return {
        isGroup: true,
        radioGroup: parent
      }
    }
  }
  console.warn(
    'ElementUI Warn: `<radio-button></radio-button>` must be use with <radio-group></radio-group>'
  )
  return {
    isGroup: false,
    radioGroup: null
  }
}

function useModel({ radioGroup }) {
  const value = computed({
    get() {
      return radioGroup.props.modelValue
    },
    set(val) {
      radioGroup.emit('update:modelValue', val)
      // radio.checked = value.value === label.value;
    }
  })

  async function handleChange() {
    await nextTick()
    radioGroup.emit('change', value.value)
  }
  return { value, handleChange }
}

function useStyle({ radioGroup, disabled, value, label, elForm, elFormItem }) {
  const { ctx } = getCurrentInstance()
  const elFormDisable = elForm.disabled

  const size = computed(() => {
    const temRadioSize = elFormItem.elFormItemSize || (ctx.$ELEMENT || {}).size
    return radioGroup.ctx.radioGroupSize || temRadioSize
  })
  const isDisabled = computed(() => {
    return radioGroup.props.disabled || disabled.value || elFormDisable
  })
  const tabIndex = computed(() => {
    return isDisabled.value || (radioGroup && value.value !== label.value)
      ? -1
      : 0
  })

  const activeStyle = computed(() => {
    return {
      backgroundColor: radioGroup.props.fill || '',
      borderColor: radioGroup.props.fill || '',
      boxShadow: radioGroup.props.fill
        ? `-1px 0 0 0 ${radioGroup.props.fill}`
        : '',
      color: radioGroup.props.textColor || ''
    }
  })

  return {
    size,
    isDisabled,
    tabIndex,
    activeStyle
  }
}
</script>
