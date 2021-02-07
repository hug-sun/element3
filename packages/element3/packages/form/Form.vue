<template>
  <form
    class="el-form"
    :class="[
      labelPosition ? 'el-form--label-' + labelPosition : '',
      { 'el-form--inline': inline }
    ]"
  >
    <slot></slot>
  </form>
</template>
<script>
import { reactive, computed, watch, toRefs, unref, provide } from 'vue'
import { useEmitter } from '../../src/composables/emitter'
import objectAssign from '../../src/utils/merge'

export default {
  name: 'ElForm',

  componentName: 'ElForm',

  props: {
    model: Object,
    rules: Object,
    labelPosition: String,
    labelWidth: String,
    labelSuffix: {
      type: String,
      default: ''
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    size: String,
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    }
  },

  emits: ['validate'],

  setup(props, { emit }) {
    const { model, rules, validateOnRuleChange, ...rest } = toRefs(props)
    const {
      autoLabelWidth,
      registerLabelWidth,
      deregisterLabelWidth
    } = useLabelWidth()

    const { fields, resetFields } = useFileds(model)
    const { validateField, validate, clearValidate } = useValidate(
      rules,
      model,
      fields,
      validateOnRuleChange
    )

    provide(
      'elForm',
      reactive({
        name: 'ElForm',
        ...rest,
        model,
        rules,
        autoLabelWidth,
        registerLabelWidth,
        deregisterLabelWidth,
        resetFields,
        validateField,
        validate,
        clearValidate,
        emit
      })
    )

    return {
      validate,
      validateField,
      resetFields,
      clearValidate
    }
  }
}

const useLabelWidth = () => {
  const potentialLabelWidthArr = reactive([])

  const autoLabelWidth = computed(() => {
    if (!potentialLabelWidthArr.length) return 0
    const max = Math.max(...potentialLabelWidthArr)
    return max ? `${max}px` : ''
  })

  const getLabelWidthIndex = (width) => {
    const index = potentialLabelWidthArr.indexOf(width)
    // it's impossible
    if (index === -1) {
      throw new Error('[ElementForm]unpected width ', width)
    }
    return index
  }

  const registerLabelWidth = (val, oldVal) => {
    if (val && oldVal) {
      const index = getLabelWidthIndex(oldVal)
      potentialLabelWidthArr.splice(index, 1, val)
    } else if (val) {
      potentialLabelWidthArr.push(val)
    }
  }

  const deregisterLabelWidth = (val) => {
    const index = getLabelWidthIndex(val)
    potentialLabelWidthArr.splice(index, 1)
  }

  return { autoLabelWidth, registerLabelWidth, deregisterLabelWidth }
}

const useFileds = (model) => {
  const fields = reactive([])
  const { on } = useEmitter()

  on('el.form.addField', (field) => {
    if (field) {
      fields.push(field)
    }
  })

  on('el.form.removeField', (field) => {
    if (field.prop) {
      fields.splice(fields.indexOf(field), 1)
    }
  })

  const resetFields = () => {
    if (!unref(model)) {
      console.warn(
        '[Element Warn][Form]model is required for resetFields to work.'
      )
      return
    }

    fields.forEach((field) => {
      field.resetField()
    })
  }

  return { fields, resetFields }
}

const useValidate = (rules, model, fields, validateOnRuleChange) => {
  const clearValidate = (props = []) => {
    const clearableFiles = props.length
      ? typeof props === 'string'
        ? fields.filter((field) => props === field.prop)
        : fields.filter((field) => props.includes(field.prop))
      : fields
    clearableFiles.forEach((field) => {
      field.clearValidate()
    })
  }

  const validate = (callback) => {
    if (!model) {
      console.warn(
        '[Element Warn][Form]model is required for validate to work!'
      )
      return
    }

    let promise
    // if no callback, return promise
    if (typeof callback !== 'function') {
      promise = new window.Promise((resolve, reject) => {
        callback = function (valid) {
          valid ? resolve(valid) : reject(valid)
        }
      })
    }

    let valid = true
    let count = 0
    // 如果需要验证的fields为空，调用验证时立刻返回callback
    if (fields.length === 0 && callback) {
      callback(valid)
    }
    let invalidFields = {}
    fields.forEach((field) => {
      field.validate('', (message, field) => {
        if (message) {
          valid = false
        }
        invalidFields = objectAssign({}, invalidFields, field)
        if (typeof callback === 'function' && ++count === fields.length) {
          callback(valid, invalidFields)
        }
      })
    })

    if (promise) {
      return promise
    }
  }

  const validateField = (props, cb) => {
    props = [].concat(props)
    const validateFields = fields.filter((field) => props.includes(field.prop))
    if (!validateFields.length) {
      console.warn('[Element Warn]please pass correct props!')
      return
    }

    validateFields.forEach((field) => {
      field.validate('', cb)
    })
  }

  if (rules) {
    watch(rules, () => {
      // remove then add event listeners on form-item after form rules change
      fields.forEach((field) => {
        field.removeValidateEvents()
        field.addValidateEvents()
      })

      if (unref(validateOnRuleChange)) {
        validate(() => {})
      }
    })
  }

  return { validateField, validate, clearValidate }
}
</script>
