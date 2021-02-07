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
import {
  computed,
  provide,
  reactive,
  inject,
  ref,
  unref,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch
} from 'vue'

import AsyncValidator from 'async-validator'
import { useEmitter } from '../../src/composables/emitter'
import objectAssign from '../../src/utils/merge'
import { noop, getPropByPath } from '../../src/utils/util'
import LabelWrap from './LabelWrap.vue'
export default {
  name: 'ElFormItem',

  componentName: 'ElFormItem',

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
    size: String
  },
  components: {
    // use this component to calculate auto width
    LabelWrap
  },

  setup(props) {
    const isNested = ref(false)
    const elForm = inject('elForm', {})
    const elFormItem = inject('elFormItem', null)
    isNested.value = !!elFormItem

    useDispatchFiled(props)
    const {
      labelFor,
      labelStyle,
      computedLabelWidth,
      updateComputedLabelWidth
    } = useLabel(props, elForm)

    const { elFormItemSize, sizeClass } = useFontSize(props, elForm)
    const { getRules, getFilteredRule } = useRules(props, elForm)
    const { contentStyle } = useContentStyle(
      props,
      elForm,
      isNested,
      computedLabelWidth
    )
    const isRequired = useIsRequired(getRules)

    const {
      validateState,
      validateMessage,
      validateDisabled,
      validate,
      clearValidate,
      resetField
    } = useValidate(props, elForm, getFilteredRule, getRules)

    const { removeValidateEvents, addValidateEvents } = useValidateEvent(
      props,
      validate,
      getRules,
      validateDisabled
    )

    provide(
      'elFormItem',
      reactive({
        name: 'ElFormItem',
        elFormItemSize,
        updateComputedLabelWidth,
        validateState
      })
    )

    return {
      labelFor,
      labelStyle,
      sizeClass,
      contentStyle,
      isRequired,
      validate,
      validateState,
      validateMessage,
      resetField,
      clearValidate,
      removeValidateEvents,
      addValidateEvents,
      elForm
    }
  }
}

function useLabel(props, elForm) {
  const computedLabelWidth = ref('')

  const labelFor = computed(() => props.for || props.prop)

  const labelStyle = computed(() => {
    const ret = {}
    if (elForm.labelPosition === 'top') return ret
    const labelWidth = props.labelWidth || elForm.labelWidth
    if (labelWidth) {
      ret.width = labelWidth
    }
    return ret
  })

  const updateComputedLabelWidth = (width) => {
    computedLabelWidth.value = width ? `${width}px` : ''
  }

  return {
    labelFor,
    labelStyle,
    computedLabelWidth,
    updateComputedLabelWidth
  }
}
function useFontSize(props, elForm) {
  const _this = getCurrentInstance()

  const elFormItemSize = computed(() => {
    return props.size || unref(elForm.size)
  })

  const sizeClass = computed(() => {
    return unref(elFormItemSize) || (_this.$ELEMENT || {}).size
  })

  return {
    elFormItemSize,
    sizeClass
  }
}

function useContentStyle(props, elForm, isNested, computedLabelWidth) {
  const contentStyle = computed(() => {
    const ret = {}
    const label = props.label

    if (elForm.labelPosition === 'top' || elForm.inline) return ret
    if (!label && !props.labelWidth && unref(isNested)) return ret

    const labelWidth = props.labelWidth || elForm.labelWidth
    if (labelWidth === 'auto') {
      if (props.labelWidth === 'auto') {
        ret.marginLeft = unref(computedLabelWidth)
      } else if (elForm.labelWidth === 'auto') {
        ret.marginLeft = elForm.autoLabelWidth
      }
    } else {
      ret.marginLeft = labelWidth
    }
    return ret
  })

  return {
    contentStyle
  }
}

function useFieldValue(props, elForm) {
  const initialValue = ref()
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
      initialValue.value = unref(fieldValue)
      if (Array.isArray(initialValue.value)) {
        initialValue.value = initialValue.value.slice()
      }
    }
  })

  return {
    fieldValue,
    initialValue
  }
}

function useDispatchFiled(props) {
  const { dispatch } = useEmitter()
  const { proxy } = getCurrentInstance()

  onMounted(() => {
    if (props.prop) {
      dispatch('el.form.addField', proxy)
    }
  })

  onBeforeUnmount(() => {
    dispatch('el.form.removeField', proxy)
  })
}

function useValidateEvent(props, validate, getRules, validateDisabled) {
  const { on, off } = useEmitter()

  const onFieldBlur = () => {
    validate('blur')
  }

  const onFieldChange = () => {
    if (unref(validateDisabled)) {
      validateDisabled.value = false
      return
    }

    validate('change')
  }

  const addValidateEvents = () => {
    const rules = getRules()

    if (rules.length || props.required !== undefined) {
      on('el.form.blur', onFieldBlur)
      on('el.form.change', onFieldChange)
    }
  }

  onMounted(() => {
    if (props.prop) {
      addValidateEvents()
    }
  })

  return {
    removeValidateEvents: off,
    addValidateEvents
  }
}

const useIsRequired = (getRules) => {
  return computed(() => {
    const rules = getRules()
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
  })
}

const useRules = (props, elForm) => {
  const getRules = () => {
    let formRules = elForm.rules
    const selfRules = props.rules
    const requiredRule =
      props.required !== undefined ? { required: !!props.required } : []

    const prop = getPropByPath(formRules, props.prop || '')
    formRules = formRules ? prop.o[props.prop || ''] || prop.v : []

    return [].concat(selfRules || formRules || []).concat(requiredRule)
  }

  const getFilteredRule = (trigger) => {
    const rules = getRules()
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
  }

  return {
    getRules,
    getFilteredRule
  }
}

function useValidate(props, elForm, getFilteredRule) {
  const { fieldValue, initialValue } = useFieldValue(props, elForm)
  const { broadcast } = useEmitter()
  const validateState = ref('')
  const validateMessage = ref('')
  const validateDisabled = ref(false)

  watch(
    () => props.error,
    (value) => {
      validateMessage.value = value
      validateState.value = value ? 'error' : ''
    },
    { immediate: true }
  )

  watch(
    () => props.validateStatus,
    (value) => (validateState.value = value)
  )

  const validate = (trigger, callback = noop) => {
    validateDisabled.value = false
    const rules = getFilteredRule(trigger)
    validateState.value = 'validating'
    if ((!rules || rules.length === 0) && props.required === undefined) {
      callback()
      return true
    }

    const descriptor = {}
    if (rules && rules.length > 0) {
      rules.forEach((rule) => {
        delete rule.trigger
      })
    }
    descriptor[props.prop] = rules

    const validator = new AsyncValidator(descriptor)
    const model = {}
    model[props.prop] = unref(fieldValue)
    validator.validate(
      model,
      { firstFields: true },
      (errors, invalidFields) => {
        validateState.value = !errors ? 'success' : 'error'
        validateMessage.value = errors ? errors[0].message : ''

        callback(validateMessage.value, invalidFields)
        elForm &&
          elForm.emit(
            'validate',
            props.prop,
            !errors,
            validateMessage.value || null
          )
      }
    )
  }

  const clearValidate = () => {
    validateState.value = ''
    validateMessage.value = ''
    validateDisabled.value = false
  }

  const resetField = () => {
    validateState.value = ''
    validateMessage.value = ''

    const model = elForm.model
    const value = unref(fieldValue)
    let path = props.prop
    if (path.indexOf(':') !== -1) {
      path = path.replace(/:/, '.')
    }

    const prop = getPropByPath(model, path, true)

    validateDisabled.value = true
    if (Array.isArray(value)) {
      prop.o[prop.k] = [].concat(initialValue.value)
    } else {
      prop.o[prop.k] = initialValue.value
    }

    // reset validateDisabled after onFieldChange triggered
    nextTick(() => {
      validateDisabled.value = false
    })

    broadcast('fieldReset', initialValue.value)
  }

  return {
    validateState,
    validateMessage,
    validateDisabled,
    validate,
    clearValidate,
    resetField
  }
}
</script>
