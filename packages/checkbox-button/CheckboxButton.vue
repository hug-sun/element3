<template>
  <label
    class="el-checkbox-button"
    role="checkbox"
    :class="[
      checkboxSize ? 'el-checkbox-button--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-checked': isChecked },
      { 'is-focus': focus }
    ]"
    :id="id"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
  >
    <input
      class="el-checkbox-button__original"
      type="checkbox"
      ref="checkbox"
      :aria-hidden="indeterminate ? 'true' : 'false'"
      :name="name"
      :disabled="isDisabled"
      :true-value="trueLabel"
      :false-value="falseLabel"
      :modelValue="model"
      :value="label"
      @change="handleChange"
      @input="model = { label, checked: $event.target.checked }"
      @focus="focus = true"
      @blur="focus = false"
    />

    <span
      class="el-checkbox-button__inner"
      v-if="$slots.default || label"
      :style="isChecked ? activeStyle : null"
    >
      <slot>{{ label }}</slot>
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
  useActiveStyle
} from '../checkbox/uses'
export default {
  name: 'ElCheckboxButton',

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

    const activeStyle = useActiveStyle()

    return {
      ...toRefs(state),
      checkbox,
      model,
      isDisabled,
      checkboxSize,
      isChecked,
      handleChange,
      activeStyle
    }
  }
}
</script>
