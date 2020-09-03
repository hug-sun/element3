<template>
  <div
    class="el-form-item"
    :class="[
      {
        'el-form-item--feedback': elForm && elForm.statusIcon,
        'is-error': validateState === 'error',
        'is-validating': validateState === 'validating',
        'is-success': validateState === 'success',
        'is-required': isRequired || required,
        'is-no-asterisk': elForm && elForm.hideRequiredAsterisk
      },
      sizeClass ? 'el-form-item--' + sizeClass : ''
    ]"
  >
    <label-wrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="elForm.labelWidth === 'auto'"
    >
      <label
        :for="labelFor"
        class="el-form-item__label"
        :style="labelStyle"
        v-if="label || $slots.label"
      >
        <slot name="label">{{ label + elForm.labelSuffix }}</slot>
      </label>
    </label-wrap>
    <div class="el-form-item__content" :style="contentStyle">
      <slot></slot>
      <transition name="el-zoom-in-top">
        <slot
          v-if="validateState === 'error' && showMessage && elForm.showMessage"
          name="error"
          :error="validateMessage"
        >
          <div
            class="el-form-item__error"
            :class="{
              'el-form-item__error--inline':
                typeof inlineMessage === 'boolean'
                  ? inlineMessage
                  : (elForm && elForm.inlineMessage) || false
            }"
          >
            {{ validateMessage }}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>
<script>
import AsyncValidator from 'async-validator'
import objectAssign from 'element-ui/src/utils/merge'
import { noop, getPropByPath } from 'element-ui/src/utils/util'
import LabelWrap from './label-wrap'
import { useEmitter } from 'element-ui/src/use/emitter'
import {
  onMounted,
  onUnmounted,
  getCurrentInstance,
  inject,
  computed,
  provide
} from 'vue'

export default {
  name: 'ElFormItem',

  componentName: 'ElFormItem',

  setup(props) {
    // 组件实例
    const vm = getCurrentInstance()
    // 组件上下文
    const ctx = vm.ctx

    // 事件派发、监听方法
    const { dispatch, on, broadcast, off } = useEmitter()

    // 注入form
    const elForm = inject('elForm')

    // provide当前组件实例
    provide('elFormItem', ctx)

    // 获取formitem对应字段值
    const fieldValue = computed(() => {
      const model = elForm.model
      if (!model || !props.prop) {
        return
      }

      let path = props.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }

      return getPropByPath(model, path, true).v
    })

    onMounted(function () {
      if (props.prop) {
        // 通知form添加自己
        dispatch('ElForm', 'el.form.addField', ctx)

        // 给formitem添加一个initialValue
        let initialValue = fieldValue
        if (Array.isArray(initialValue)) {
          initialValue = [].concat(initialValue)
        }
        Object.defineProperty(ctx, 'initialValue', {
          value: initialValue.value
        })

        // 监听blur和change两个事件，触发校验
        const rules = ctx.getRules()

        if (rules.length || ctx.required !== undefined) {
          on('el.form.blur', ctx.onFieldBlur)
          on('el.form.change', ctx.onFieldChange)
        }
      }
    })

    onUnmounted(function () {
      // 通知form移除自己
      dispatch('ElForm', 'el.form.removeField', ctx)
    })

    return {
      fieldValue,
      broadcast,
      off,
      elForm
    }
  },

  props: {
    label: String,
    labelWidth: String,
    prop: String,
    required: {
      type: Boolean,
      default: undefined
    },
    rules: [Object, Array],
    error: String,
    validateStatus: String,
    for: String,
    inlineMessage: {
      type: [String, Boolean],
      default: ''
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    size: String,
    disabled: Boolean
  },
  components: {
    // use this component to calculate auto width
    LabelWrap
  },
  watch: {
    error: {
      immediate: true,
      handler(value) {
        this.validateMessage = value
        this.validateState = value ? 'error' : ''
      }
    },
    validateStatus(value) {
      this.validateState = value
    }
  },
  computed: {
    labelFor() {
      return this.for || this.prop
    },
    labelStyle() {
      const ret = {}
      if (this.elForm.labelPosition === 'top') return ret
      const labelWidth = this.labelWidth || this.elForm.labelWidth
      if (labelWidth) {
        ret.width = labelWidth
      }
      return ret
    },
    contentStyle() {
      const ret = {}
      const label = this.label
      if (this.elForm.labelPosition === 'top' || this.elForm.inline) return ret
      if (!label && !this.labelWidth && this.isNested) return ret
      const labelWidth = this.labelWidth || this.elForm.labelWidth
      if (labelWidth === 'auto') {
        if (this.labelWidth === 'auto') {
          ret.marginLeft = this.computedLabelWidth
        } else if (this.elForm.labelWidth === 'auto') {
          ret.marginLeft = this.elForm.autoLabelWidth
        }
      } else {
        ret.marginLeft = labelWidth
      }
      return ret
    },
    form() {
      let parent = this.$parent
      let parentName = parent.$options.componentName
      while (parentName !== 'ElForm') {
        if (parentName === 'ElFormItem') {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.isNested = true
        }
        parent = parent.$parent
        parentName = parent.$options.componentName
      }
      return parent
    },
    isRequired() {
      const rules = this.getRules()
      let isRequired = false

      if (rules && rules.length) {
        rules.every((rule) => {
          if (rule.required) {
            isRequired = true
            return false
          }
          return true
        })
      }
      return isRequired
    },
    _formSize() {
      return this.elForm.size
    },
    elFormItemSize() {
      return this.size || this._formSize
    },
    sizeClass() {
      return this.elFormItemSize || (this.$ELEMENT || {}).size
    }
  },
  data() {
    return {
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {},
      isNested: false,
      computedLabelWidth: ''
    }
  },
  methods: {
    validate(trigger, callback = noop) {
      this.validateDisabled = false
      const rules = this.getFilteredRule(trigger)
      if ((!rules || rules.length === 0) && this.required === undefined) {
        callback()
        return true
      }

      this.validateState = 'validating'

      const descriptor = {}
      if (rules && rules.length > 0) {
        rules.forEach((rule) => {
          delete rule.trigger
        })
      }
      descriptor[this.prop] = rules

      const validator = new AsyncValidator(descriptor)
      const model = {}

      model[this.prop] = this.fieldValue

      validator.validate(
        model,
        { firstFields: true },
        (errors, invalidFields) => {
          this.validateState = !errors ? 'success' : 'error'
          this.validateMessage = errors ? errors[0].message : ''

          callback(this.validateMessage, invalidFields)
          this.elForm &&
            this.elForm.$emit(
              'validate',
              this.prop,
              !errors,
              this.validateMessage || null
            )
        }
      )
    },
    clearValidate() {
      this.validateState = ''
      this.validateMessage = ''
      this.validateDisabled = false
    },
    resetField() {
      this.validateState = ''
      this.validateMessage = ''

      const model = this.elForm.model
      const value = this.fieldValue
      let path = this.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }

      const prop = getPropByPath(model, path, true)

      this.validateDisabled = true
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue)
      } else {
        prop.o[prop.k] = this.initialValue
      }

      // reset validateDisabled after onFieldChange triggered
      this.$nextTick(() => {
        this.validateDisabled = false
      })

      this.broadcast('ElTimeSelect', 'fieldReset', this.initialValue)
    },
    getRules() {
      // 表单中设置的rules
      let formRules = this.elForm.rules
      // 表单项设置的rules
      const selfRules = this.rules
      // required属性转换为必填规则
      const requiredRule =
        this.required !== undefined ? { required: !!this.required } : []
      // 获取prop对应规则属性
      const prop = getPropByPath(formRules, this.prop || '')
      // 先从formRules中直接获取prop对应规则
      // 如果没有则以点语法解析对应规则
      formRules = formRules ? prop.o[this.prop || ''] || prop.v : []
      // 最终返回校验规则首选表单项定义的规则，次选表单上定义的规则
      return [].concat(selfRules || formRules || []).concat(requiredRule)
    },
    getFilteredRule(trigger) {
      const rules = this.getRules()

      return rules
        .filter((rule) => {
          if (!rule.trigger || trigger === '') return true
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1
          } else {
            return rule.trigger === trigger
          }
        })
        .map((rule) => objectAssign({}, rule))
    },
    onFieldBlur() {
      this.validate('blur')
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false
        return
      }

      this.validate('change')
    },
    updateComputedLabelWidth(width) {
      this.computedLabelWidth = width ? `${width}px` : ''
    },

    removeValidateEvents() {
      this.off()
    }
  }
}
</script>
