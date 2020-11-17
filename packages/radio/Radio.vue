<template>
  <label
    class="el-radio"
    :class="[
      border && radioSize ? 'el-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span
      class="el-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="el-radio__inner"></span>
      <input
        ref="radio"
        class="el-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      />
    </span>
    <span class="el-radio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
import {
  ref,
  computed,
  toRefs,
  nextTick,
  getCurrentInstance,
  inject,
  unref
} from 'vue'

export default {
  name: 'ElRadio',

  componentName: 'ElRadio',

  props: {
    modelValue: [String, Number, Symbol, Boolean],
    label: [String, Number, Symbol, Boolean],
    disabled: Boolean,
    name: String,
    border: Boolean,
    size: String
  },

  emits: ['update:modelValue', 'change'],

  setup(props) {
    const { modelValue, label, size, disabled } = toRefs(props)
    const radio = ref()
    const focus = ref(false)

    const { elForm, elFormItem } = useInject()

    const { isGroup, radioGroup } = useCheckGroup()

    const { model, handleChange } = useModel({
      isGroup,
      radioGroup,
      modelValue,
      label,
      radio
    })

    const { radioSize, isDisabled, tabIndex } = useStyle({
      isGroup,
      radioGroup,
      size,
      disabled,
      model,
      label,
      elForm,
      elFormItem
    })
    return {
      radio,
      focus,
      model,
      radioSize,
      isDisabled,
      tabIndex,
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
  return {
    isGroup: false,
    radioGroup: null
  }
}

function useModel({ isGroup, radioGroup, modelValue, radio, label }) {
  const { emit } = getCurrentInstance()

  const model = computed({
    get() {
      const res = isGroup ? radioGroup.proxy.modelValue : modelValue
      return unref(res)
    },
    set(val) {
      if (isGroup) {
        radioGroup.emit('update:modelValue', val)
      } else {
        emit('update:modelValue', val)
      }
      radio.value && (radio.value.checked = unref(model) === unref(label))
    }
  })

  async function handleChange() {
    await nextTick()
    emit('change', model.value)
    isGroup && radioGroup.emit('change', model.value)
  }
  return { model, handleChange }
}

function useStyle({
  isGroup,
  radioGroup,
  size,
  disabled,
  model,
  label,
  elForm,
  elFormItem
}) {
  const { ctx } = getCurrentInstance()
  const elFormDisable = elForm.disabled
  const radioSize = computed(() => {
    const temRadioSize =
      unref(size) || elFormItem.elFormItemSize || (ctx.$ELEMENT || {}).size
    return isGroup
      ? radioGroup.ctx.radioGroupSize || temRadioSize
      : temRadioSize
  })
  const isDisabled = computed(() => {
    return isGroup
      ? radioGroup.props.disabled || disabled.value || elFormDisable
      : disabled.value || elFormDisable
  })

  const tabIndex = computed(() => {
    return isDisabled.value || (isGroup && model.value !== label.value) ? -1 : 0
  })

  return {
    radioSize,
    isDisabled,
    tabIndex
  }
}
</script>
