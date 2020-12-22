export const props = {
  modelValue: {
    type: [String, Number, Symbol, Boolean, Array],
    default: ''
  },
  label: {
    type: [String, Number, Symbol, Boolean, Array],
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ''
  },
  border: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: ''
  }
}
