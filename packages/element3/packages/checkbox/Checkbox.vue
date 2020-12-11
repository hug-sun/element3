<template>
  <label
    class="el-checkbox"
    role="checkbox"
    :class="[
      isBorder && checkboxSize ? 'el-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': isBorder },
      { 'is-checked': isChecked }
    ]"
    :id="id"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
  >
    <span
      class="el-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
      :tabindex="indeterminate ? 0 : false"
      :role="indeterminate ? 'checkbox' : false"
      :aria-checked="indeterminate ? 'mixed' : false"
    >
      <span class="el-checkbox__inner"></span>
      <input
        class="el-checkbox__original"
        type="checkbox"
        ref="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        :value="label"
        @change="handleChange"
        @input="model = { label, checked: $event.target.checked }"
        @focus="focus = true"
        @blur="focus = false"
      />
    </span>
    <span class="el-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
import { reactive, toRefs } from 'vue'
import {
  useModel,
  useAria,
  useCheckSelected,
  useSize,
  useLimit,
  useDisabled,
  useBorder
} from './uses.js'
export default {
  name: 'ElCheckbox',

  props: {
    modelValue: [String, Number, Boolean, Symbol, Array],
    label: [String, Number, Boolean, Symbol],
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: { type: [String, Number, Boolean], default: true },
    falseLabel: { type: [String, Number, Boolean], default: false },
    id: String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系 */,
    controls: String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系 */,
    border: Boolean,
    size: String
  },

  emits: ['update:modelValue', 'change'],

  setup() {
    const state = reactive({
      focus: false
    })

    useAria()

    const { model, handleChange } = useModel()

    const isLimit = useLimit({ model })

    const { isChecked, checkbox } = useCheckSelected({ model })

    const checkboxSize = useSize()

    const isDisabled = useDisabled({ isLimit })

    const isBorder = useBorder()

    return {
      ...toRefs(state),
      checkbox,
      model,
      isDisabled,
      checkboxSize,
      isChecked,
      handleChange,
      isBorder
    }
  }
}
</script>
