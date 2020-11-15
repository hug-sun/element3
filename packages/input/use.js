import { computed, inject, ref, unref, nextTick, watch } from 'vue'
import merge from '../../src/utils/merge'
import { isKorean } from '../../src/utils/shared'
import calcTextareaHeight from './calcTextareaHeight'

export const useValidate = () => {
  const elFormItem = inject('elFormItem', '')
  const validateState = computed(() => {
    return elFormItem ? elFormItem.validateState : ''
  })
  const validateIcon = computed(() => {
    return {
      validating: 'el-icon-loading',
      success: 'el-icon-circle-check',
      error: 'el-icon-circle-close'
    }[unref(validateState)]
  })

  return { validateState, validateIcon }
}

export const useTextarea = ({ autosize, type, resize }, textareaCalcStyle) => {
  const textarea = ref(null)

  const textareaStyle = computed(() => {
    return merge({}, textareaCalcStyle.value, { resize: unref(resize) })
  })

  const resizeTextarea = () => {
    // if (this.$isServer) return;
    if (type.value !== 'textarea') return
    if (!autosize.value) {
      textareaCalcStyle.value = {
        minHeight: calcTextareaHeight(unref(textarea)).minHeight
      }
      return
    }
    const minRows = autosize.value.minRows
    const maxRows = autosize.value.maxRows
    textareaCalcStyle.value = calcTextareaHeight(
      unref(textarea),
      minRows,
      maxRows
    )
  }

  return { textarea, textareaStyle, resizeTextarea }
}

export const useInput = (
  {
    size,
    type,
    disabled,
    modelValue,
    suffixIcon,
    readonly,
    clearable,
    showPassword,
    showWordLimit
  },
  { hovering, focused },
  instance,
  textarea,
  attrs,
  validateState,
  needStatusIcon,
  slots
) => {
  const input = ref(null)

  const elFormItem = inject('elFormItem', {})
  const elForm = inject('elForm', {})

  const _elFormItemSize = computed(() => {
    return unref(elFormItem.elFormItemSize)
  })
  const inputSize = computed(() => {
    return (
      unref(size) ||
      unref(_elFormItemSize) ||
      (instance.proxy.$ELEMENT || {}).size
    )
  })

  const inputDisabled = computed(() => {
    return unref(disabled) || unref(elForm.disabled)
  })

  const nativeInputValue = computed(() => {
    return unref(modelValue) === null || unref(modelValue) === undefined
      ? ''
      : String(unref(modelValue))
  })

  const textLength = computed(() => {
    if (typeof unref(modelValue) === 'number') {
      return String(unref(modelValue)).length
    }

    return (unref(modelValue) || '').length
  })

  const upperLimit = computed(() => {
    return Number(attrs.maxlength)
  })

  const isWordLimitVisible = computed(() => {
    return (
      unref(showWordLimit) &&
      attrs.maxlength &&
      (unref(type) === 'text' || unref(type) === 'textarea') &&
      !unref(inputDisabled) &&
      !unref(readonly) &&
      !unref(showPassword)
    )
  })

  const inputExceed = computed(() => {
    // show exceed style if length of initial value greater then maxlength
    return unref(isWordLimitVisible) && unref(textLength) >= unref(upperLimit)
  })

  const showClear = computed(() => {
    return (
      unref(clearable) &&
      !unref(inputDisabled) &&
      !unref(readonly) &&
      unref(nativeInputValue) &&
      (unref(focused) || unref(hovering))
    )
  })
  const showPwdVisible = computed(() => {
    return (
      unref(showPassword) &&
      !unref(inputDisabled) &&
      !unref(readonly) &&
      (!!unref(nativeInputValue) || unref(focused))
    )
  })
  const getSuffixVisible = () => {
    return (
      slots.suffix ||
      unref(suffixIcon) ||
      unref(showClear) ||
      unref(showPassword) ||
      unref(isWordLimitVisible) ||
      (unref(validateState) && unref(needStatusIcon))
    )
  }

  return {
    input: input.value || textarea,
    inputSize,
    inputDisabled,
    nativeInputValue,
    isWordLimitVisible,
    inputExceed,
    upperLimit,
    textLength,
    showClear,
    showPwdVisible,
    getSuffixVisible
  }
}

export const useInteractive = (
  instance,
  input,
  textarea,
  { modelValue, validateEvent },
  { focused, isComposing, passwordVisible },
  nativeInputValue,
  emit,
  slots
) => {
  const getInput = () => {
    return unref(input) || unref(textarea)
  }

  const focus = () => {
    getInput().focus()
  }

  const blur = () => {
    getInput().blur()
  }

  const select = () => {
    getInput().select()
  }

  const setNativeInputValue = () => {
    const input = getInput()
    if (!input) return
    if (input.value === unref(nativeInputValue)) return
    input.value = unref(nativeInputValue)
  }

  const handleBlur = (event) => {
    focused.value = false
    emit('blur', event)
    if (unref(validateEvent)) {
      instance.proxy.dispatch('el.form.blur', [unref(modelValue)])
    }
  }

  const handleFocus = (event) => {
    focused.value = true
    emit('focus', event)
  }

  const handleInput = (event) => {
    // should not emit input during composition
    // see: https://github.com/ElemeFE/element/issues/10516
    if (unref(isComposing)) return

    // hack for https://github.com/ElemeFE/element/issues/8548
    // should remove the following line when we don't support IE
    if (event.target.value === unref(nativeInputValue)) return
    emit('update:modelValue', event.target.value)
    emit('input', event.target.value)

    // ensure native input value is controlled
    // see: https://github.com/ElemeFE/element/issues/12850
    nextTick(setNativeInputValue)
  }

  const handleChange = (event) => {
    emit('update:modelValue', event.target.value)
    emit('change', event.target.value)
  }

  const handleCompositionStart = () => {
    isComposing.value = true
  }

  const handleCompositionUpdate = (event) => {
    const text = event.target.value
    const lastCharacter = text[text.length - 1] || ''
    isComposing.value = !isKorean(lastCharacter)
  }

  const handleCompositionEnd = (event) => {
    if (unref(isComposing)) {
      isComposing.value = false
      handleInput(event)
    }
  }

  const clear = () => {
    emit('update:modelValue', '')
    emit('input', '')
    emit('change', '')
    emit('clear')
  }

  const handlePasswordVisible = () => {
    passwordVisible.value = !unref(passwordVisible)
    focus()
  }

  const calcIconOffset = (place) => {
    const $el = instance.proxy.$el
    const elList = [].slice.call(
      $el.querySelectorAll(`.el-input__${place}`) || []
    )
    if (!elList.length) return
    let el = null
    for (let i = 0; i < elList.length; i++) {
      if (elList[i].parentNode === $el) {
        el = elList[i]
        break
      }
    }
    if (!el) return
    const pendantMap = {
      suffix: 'append',
      prefix: 'prepend'
    }

    const pendant = pendantMap[place]
    if (slots[pendant]) {
      el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${
        $el.querySelector(`.el-input-group__${pendant}`).offsetWidth
      }px)`
    } else {
      el.removeAttribute('style')
    }
  }

  const updateIconOffset = () => {
    calcIconOffset('prefix')
    calcIconOffset('suffix')
  }

  watch(
    () => unref(nativeInputValue),
    () => {
      setNativeInputValue()
    }
  )

  return {
    focus,
    blur,
    select,
    setNativeInputValue,
    getInput,
    handleBlur,
    handleFocus,
    handleInput,
    handleChange,
    handleCompositionStart,
    handleCompositionUpdate,
    handleCompositionEnd,
    clear,
    handlePasswordVisible,
    updateIconOffset
  }
}

export const useStatusIcon = () => {
  const elForm = inject('elForm', {})

  const needStatusIcon = computed(() => {
    return !!unref(elForm).statusIcon
  })

  return {
    needStatusIcon
  }
}
