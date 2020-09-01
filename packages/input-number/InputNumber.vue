<template>
  <div
    @dragstart.prevent
    :class="[
      'el-input-number',
      inputNumberSize ? 'el-input-number--' + inputNumberSize : '',
      { 'is-disabled': inputNumberDisabled },
      { 'is-without-controls': !controls },
      { 'is-controls-right': controlsAtRight }
    ]"
  >
    <span
      class="el-input-number__decrease"
      role="button"
      v-if="controls"
      v-repeat-click="decrease"
      :class="{ 'is-disabled': minDisabled }"
      @keydown.enter="decrease"
    >
      <i :class="`el-icon-${controlsAtRight ? 'arrow-down' : 'minus'}`"></i>
    </span>
    <span
      class="el-input-number__increase"
      role="button"
      v-if="controls"
      v-repeat-click="increase"
      :class="{ 'is-disabled': maxDisabled }"
      @keydown.enter="increase"
    >
      <i :class="`el-icon-${controlsAtRight ? 'arrow-up' : 'plus'}`"></i>
    </span>
    <el-input
      ref="input"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="inputNumberDisabled"
      :size="inputNumberSize.value"
      :max="max"
      :min="min"
      :name="name"
      :label="label"
      @keydown.up.prevent="increase"
      @keydown.down.prevent="decrease"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @change="handleInputChange"
    ></el-input>
  </div>
</template>
<script>
import ElInput from 'element-ui/packages/input'
import Focus from 'element-ui/src/mixins/focus'
// import useFocus from 'element-ui/src/use/focus'
import RepeatClick from 'element-ui/src/directives/repeatClick'
import { ref } from 'vue'
import { useInputNumber, useInputNumberInteractive } from './use'
export default {
  name: 'ElInputNumber',
  mixins: [Focus('input')],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  emits: ['input', 'change', 'blur', 'clear', 'focus', 'update:modelValue'],
  directives: {
    repeatClick: RepeatClick
  },
  components: {
    ElInput
  },
  props: {
    step: {
      type: Number,
      default: 1
    },
    stepStrictly: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    value: {},
    disabled: Boolean,
    size: String,
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
      default: ''
    },
    name: String,
    label: String,
    placeholder: String,
    precision: {
      type: Number,
      validator(val) {
        return val >= 0 && val === parseInt(val, 10)
      }
    }
  },
  methods: {
    select() {
      this.$refs.input.select()
    }
  },
  mounted() {
    const innerInput = this.$refs.input.$refs.input
    innerInput.setAttribute('role', 'spinbutton')
    innerInput.setAttribute('aria-valuemax', this.max)
    innerInput.setAttribute('aria-valuemin', this.min)
    innerInput.setAttribute('aria-valuenow', this.currentValue)
    innerInput.setAttribute('aria-disabled', this.inputNumberDisabled)
  },
  updated() {
    if (!this.$refs || !this.$refs.input) return
    const innerInput = this.$refs.input.$refs.input
    innerInput.setAttribute('aria-valuenow', this.currentValue)
  },

  setup(props, { emit }) {
    const {
      min,
      max,
      size,
      step,
      value,
      disabled,
      controls,
      precision,
      stepStrictly,
      controlsPosition
    } = props
    const userInput = ref(null)
    const currentValue = ref(0)
    const {
      inputNumberSize,
      inputNumberDisabled,
      controlsAtRight,
      numPrecision,
      minDisabled,
      maxDisabled,
      toPrecision,
      displayValue,
      _increase,
      _decrease
    } = useInputNumber({
      min,
      max,
      size,
      step,
      value,
      userInput,
      disabled,
      controls,
      precision,
      currentValue,
      controlsPosition
    })
    const {
      increase,
      decrease,
      handleBlur,
      handleFocus,
      handleInput,
      setCurrentValue,
      handleInputChange
    } = useInputNumberInteractive({
      max,
      min,
      emit,
      step,
      value,
      userInput,
      precision,
      _increase,
      _decrease,
      toPrecision,
      maxDisabled,
      minDisabled,
      currentValue,
      stepStrictly,
      inputNumberDisabled
    })
    return {
      increase,
      decrease,
      inputNumberSize,
      inputNumberDisabled,
      controlsAtRight,
      numPrecision,
      minDisabled,
      maxDisabled,
      displayValue,
      handleBlur,
      handleFocus,
      handleInput,
      setCurrentValue,
      handleInputChange
    }
  }
}
</script>
