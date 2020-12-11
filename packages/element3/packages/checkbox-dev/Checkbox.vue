<template>
  <label
    role="checkbox"
    :class="[
      'el-checkbox',
      isBorder && checkboxSize ? `el-checkbox--${checkboxSize}` : '',
      {
        'is-bordered': isBorder,
        'is-disabled': isDisabled,
        'is-checked': isChecked
      }
    ]"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
  >
    <span
      :class="[
        'el-checkbox__input',
        {
          'is-disabled': isDisabled,
          'is-checked': isChecked,
          'is-indeterminate': indeterminate,
          'is-focus': isFocus
        }
      ]"
      :tabindex="indeterminate ? 0 : false"
      :role="indeterminate ? 'checkbox' : false"
      :aria-checked="indeterminate ? 'mixed' : false"
    >
      <span class="el-checkbox__inner"></span>
      <input
        class="el-checkbox__original"
        ref="checkboxRef"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        type="checkbox"
        :value="label"
        @input="inputHandle({ checked: $event.target.checked })"
        @focus="isFocus = true"
        @blur="isFocus = false"
        :aria-hidden="indeterminate ? 'true' : 'false'"
      />
    </span>
    <span class="el-checkbox__label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script>
import {
  toRefs,
  inject,
  unref,
  getCurrentInstance,
  computed,
  watchEffect,
  reactive,
  ref,
  onMounted
} from 'vue'
import { useGlobalOptions } from '../../src/use/globalConfig'
export default {
  name: 'Checkbox',
  emits: ['update:modelValue'],
  setup(props) {
    const {
      border,
      size,
      disabled,
      modelValue,
      trueLabel,
      falseLabel,
      checked
    } = toRefs(props)

    const isFocus = ref(false)

    const { inputHandle, model } = useModel()
    const { checkboxRef, isChecked } = useInitSelect({
      model,
      trueLabel,
      checked
    })
    const { isBorder } = useBorder(border)
    const { isDisabled } = useDisabled(disabled)
    const { checkboxSize } = useSize(size)

    return {
      inputHandle,
      isBorder,
      checkboxSize,
      isDisabled,
      checkboxRef,
      isChecked,
      isFocus
    }
  },
  props: {
    label: String,
    modelValue: [String, Number, Boolean, Symbol, Array],
    border: Boolean,
    size: {
      type: String,
      validator(val) {
        if (val === '') return true
        return ['medium', 'small', 'mini'].includes(val)
      }
    },
    disabled: Boolean,
    name: String,
    trueLabel: {
      type: [String, Number, Boolean],
      default: true
    },
    falseLabel: {
      type: [String, Number, Boolean],
      default: false
    },
    checked: Boolean,
    indeterminate: Boolean
  }
}

function useBorder(border) {
  const { elCheckboxGroup, elFormItem } = useInject()
  const isBorder = border?.value || elCheckboxGroup.border || elFormItem.border

  return {
    isBorder
  }
}

function useSize(size) {
  const globalConfig = useGlobalOptions()
  const { elCheckboxGroup, elFormItem } = useInject()
  const checkboxSize =
    size?.value || elCheckboxGroup.size || elFormItem.size || globalConfig.size

  return {
    checkboxSize
  }
}

function useDisabled(disabled) {
  const { elCheckboxGroup, elFormItem } = useInject()
  const isDisabled =
    disabled?.value || elCheckboxGroup.disabled || elFormItem.disabled

  return {
    isDisabled
  }
}

function useModel() {
  const { modelValue, trueLabel, falseLabel } = onlyProps('modelValue', 'trueLabel', 'falseLabel')
  const vm = getCurrentInstance()
  const state = reactive({
    modelValue: false
  })

  watchEffect(() => {
    state.modelValue = modelValue.value
  })

  const inputHandle = ({ checked }) => {
    const modelValue = checked ? trueLabel : falseLabel
    state.modelValue = unref(modelValue)
    vm.emit('update:modelValue', unref(modelValue))
  }

  const model = computed({
    get() {
      return state.modelValue
    },
    set: inputHandle
  })

  return {
    inputHandle,
    model
  }
}

function useInitSelect({ model, trueLabel, checked }) {
  const checkboxRef = ref(null)

  onMounted(() => {
    if (checked.value) {
      model.value = { checked: checked.value }
    }
  })

  const isChecked = computed(() => {
    const _isChecked = unref(model) === unref(trueLabel)
    checkboxRef.value && (checkboxRef.value.checked = _isChecked)
    return _isChecked
  })

  return {
    checkboxRef,
    isChecked
  }
}

function useInject() {
  const elCheckboxGroup = inject('elCheckboxGroup', {})
  const elFormItem = inject('elFormItem', {})

  return {
    elCheckboxGroup,
    elFormItem
  }
}

function onlyProps () {
  const { props } = getCurrentInstance()
  return Array.prototype.reduce.call(arguments, (res, prop) => {
    const val = props[prop]
    if (val !== undefined) {
      res[prop] = ref(val)
    }
    return res
  }, {})
}
</script>

<style scoped lang="scss"></style>
