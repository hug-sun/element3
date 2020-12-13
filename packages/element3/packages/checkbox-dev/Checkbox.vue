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
    :id="id"
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
        @input="model = { checked: $event.target.checked }"
        @focus="isFocus = true"
        @blur="isFocus = false"
        @change="changeHandle"
        :aria-hidden="indeterminate ? 'true' : 'false'"
      />
    </span>
    <span class="el-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script>
import {
  computed,
  getCurrentInstance,
  inject,
  onMounted,
  reactive,
  ref,
  toRefs,
  unref,
  watchEffect,
  nextTick
} from 'vue'
import { useGlobalOptions } from '../../src/use/globalConfig'

export default {
  name: 'Checkbox',
  emits: ['update:modelValue', 'change'],
  setup(props) {
    const { border, size, disabled } = toRefs(props)

    const isFocus = ref(false)

    const { changeHandle, model } = useModel()
    const { checkboxRef, isChecked } = useInitSelect(model)
    const { isBorder } = useBorder(border)
    const { isDisabled } = useDisabled(disabled)
    const { checkboxSize } = useSize(size)

    return {
      changeHandle,
      isBorder,
      checkboxSize,
      isDisabled,
      checkboxRef,
      isChecked,
      isFocus,
      model
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
    indeterminate: Boolean,
    id: String,
    controls: String
  }
}

function useBorder(border) {
  const { elCheckboxGroup } = useInject()
  const isBorder = border?.value || elCheckboxGroup.border

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
  const { modelValue, trueLabel, falseLabel } = onlyProps()
  const vm = getCurrentInstance()
  const state = reactive({
    modelValue: false
  })

  watchEffect(() => {
    state.modelValue = modelValue.value
  })

  const model = computed({
    get() {
      return state.modelValue
    },
    set({ checked }) {
      const modelValue = checked ? trueLabel : falseLabel
      state.modelValue = unref(modelValue)
      vm.emit('update:modelValue', unref(modelValue))
    }
  })

  const changeHandle = async () => {
    await nextTick()
    vm.emit('change', unref(model))
  }

  return {
    model,
    changeHandle
  }
}

function useInitSelect(model) {
  const { trueLabel, checked } = onlyProps()
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

function onlyProps() {
  return toRefs(getCurrentInstance().props)
}
</script>

<style scoped lang="scss"></style>
