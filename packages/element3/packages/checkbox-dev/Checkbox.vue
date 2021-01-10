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
  ref,
  toRefs,
  nextTick
} from 'vue'
import { useSize, useDisabled } from './common'
import { useEmitter } from '../../src/use/emitter'

export default {
  name: 'ElCheckbox',
  emits: ['update:modelValue', 'change'],
  setup(props) {
    const { border, size, disabled } = toRefs(props)

    const isFocus = ref(false)

    const { changeHandle, model } = useModel()
    const { checkboxRef, isChecked } = useInitSelect(model)
    const { isBorder } = useBorder(border)
    const { isDisabled } = useDisabled(disabled, isChecked)
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
      validator: (val) => {
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
  const isBorder = computed(() => {
    return border?.value || elCheckboxGroup.proxy.border
  })

  return {
    isBorder
  }
}

function useModel() {
  const { modelValue, trueLabel, falseLabel, label } = onlyProps()
  const { elCheckboxGroup } = useInject()
  const vm = getCurrentInstance()
  const { dispatch } = useEmitter()
  /**
   * elCheckboxGroup.modelValue may be a normal array or a reactive array
   */
  const parentModelValue = computed(() => elCheckboxGroup.proxy.modelValue)
  const state = computed(() => {
    return modelValue.value || parentModelValue.value || false
  })

  const model = computed({
    get() {
      return state.value
    },
    set({ checked }) {
      let modelValue = model.value
      if (label && label.value && Array.isArray(model.value)) {
        const index = modelValue.indexOf(label.value)
        index === -1 && checked
          ? modelValue.push(label.value)
          : modelValue.splice(index, 1)
        dispatch('update:modelValue', modelValue)
      } else {
        modelValue = checked ? trueLabel.value : falseLabel.value
        vm.emit('update:modelValue', modelValue)
      }
    }
  })

  const changeHandle = async () => {
    await nextTick()
    vm.emit('change', model.value)
    dispatch('change', model.value)
  }

  return {
    model,
    changeHandle
  }
}

function useInitSelect(model) {
  const { trueLabel, checked, label } = onlyProps()
  const checkboxRef = ref(null)

  onMounted(() => {
    if (checked.value) {
      model.value = { checked: checked.value }
    }
  })

  const isChecked = computed(() => {
    const _isChecked = Array.isArray(model.value)
      ? model.value.includes(label.value)
      : model.value === trueLabel.value

    checkboxRef.value && (checkboxRef.value.checked = _isChecked)
    return _isChecked
  })

  return {
    checkboxRef,
    isChecked
  }
}

function useInject() {
  const elCheckboxGroup = inject('elCheckboxGroup', { proxy: {} })
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
