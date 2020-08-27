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
import objectAssign from 'element-ui/src/utils/merge'
import { reactive, computed, watch, toRefs, onBeforeMount } from 'vue'
import { useEmitter } from 'element-ui/src/use/emitter'

export default {
  name: 'ElForm',

  componentName: 'ElForm',

  provide() {
    return {
      elForm: this
    }
  },

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
  setup(props) {
    const { on } = useEmitter()

    const data = reactive({
      fields: [],
      potentialLabelWidthArr: [], // use this array to calculate auto width
      autoLabelWidth: computed(() => {
        if (!data.potentialLabelWidthArr.length) return 0
        const max = Math.max(...data.potentialLabelWidthArr)
        return max ? `${max}px` : ''
      })
    })

    onBeforeMount(() => {
      on('el.form.addField', (field) => {
        if (field) {
          data.fields.push(field)
        }
      })
      /* istanbul ignore next */
      on('el.form.removeField', (field) => {
        if (field.prop) {
          data.fields.splice(data.fields.indexOf(field), 1)
        }
      })
    })

    // 监听校验规则，若变化重新执行校验
    watch(
      () => props.rules,
      () => {
        // remove then add event listeners on form-item after form rules change
        data.fields.forEach((field) => {
          field.removeValidateEvents()
          field.addValidateEvents()
        })

        if (props.validateOnRuleChange) {
          validate(() => {})
        }
      }
    )

    // 表单全局校验
    function validate(callback) {
      if (!props.model) {
        console.warn(
          '[Element Warn][Form]model is required for validate to work!'
        )
        return
      }

      let promise
      // if no callback, return promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = function (valid) {
            valid ? resolve(valid) : reject(valid)
          }
        })
      }

      let valid = true
      let count = 0
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (data.fields.length === 0 && callback) {
        // eslint-disable-next-line standard/no-callback-literal
        callback(true)
      }
      let invalidFields = {}
      data.fields.forEach((field) => {
        field.validate('', (message, field) => {
          if (message) {
            valid = false
          }
          invalidFields = objectAssign({}, invalidFields, field)
          if (
            typeof callback === 'function' &&
            ++count === data.fields.length
          ) {
            callback(valid, invalidFields)
          }
        })
      })

      if (promise) {
        return promise
      }
    }
    function resetFields() {
      // 字段重置
      if (!props.model) {
        console.warn(
          '[Element Warn][Form]model is required for resetFields to work.'
        )
        return
      }
      data.fields.forEach((field) => {
        field.resetField()
      })
    }
    function getLabelWidthIndex(width) {
      const index = data.potentialLabelWidthArr.indexOf(width)
      // it's impossible
      if (index === -1) {
        throw new Error('[ElementForm]unpected width ', width)
      }
      return index
    }
    function clearValidate(props = []) {
      const fields = props.length
        ? typeof props === 'string'
          ? data.fields.filter((field) => props === field.prop)
          : data.fields.filter((field) => props.indexOf(field.prop) > -1)
        : data.fields
      fields.forEach((field) => {
        field.clearValidate()
      })
    }
    function validateField(props, cb) {
      props = [].concat(props)
      const fields = data.fields.filter(
        (field) => props.indexOf(field.prop) !== -1
      )
      if (!fields.length) {
        console.warn('[Element Warn]please pass correct props!')
        return
      }

      fields.forEach((field) => {
        field.validate('', cb)
      })
    }
    function registerLabelWidth(val, oldVal) {
      if (val && oldVal) {
        const index = getLabelWidthIndex(oldVal)
        data.potentialLabelWidthArr.splice(index, 1, val)
      } else if (val) {
        data.potentialLabelWidthArr.push(val)
      }
    }
    function deregisterLabelWidth(val) {
      const index = getLabelWidthIndex(val)
      data.potentialLabelWidthArr.splice(index, 1)
    }

    return {
      ...toRefs(data),
      resetFields,
      clearValidate,
      validate,
      validateField,
      getLabelWidthIndex,
      registerLabelWidth,
      deregisterLabelWidth
    }
  }
}
</script>
