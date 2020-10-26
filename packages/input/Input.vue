<template>
  <div
    :class="[
      classProp,
      type === 'textarea' ? 'el-textarea' : 'el-input',
      inputSize ? 'el-input--' + inputSize : '',
      {
        'is-disabled': inputDisabled,
        'is-exceed': inputExceed,
        'el-input-group': $slots.prepend || $slots.append,
        'el-input-group--append': $slots.append,
        'el-input-group--prepend': $slots.prepend,
        'el-input--prefix': $slots.prefix || prefixIcon,
        'el-input--suffix':
          $slots.suffix || suffixIcon || clearable || showPassword
      }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="el-input__inner"
        v-bind="$attrs"
        :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      />
      <!-- 前置内容 -->
      <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="el-input__icon" v-if="prefixIcon" :class="prefixIcon"></i>
      </span>
      <!-- 后置内容 -->
      <span class="el-input__suffix" v-if="getSuffixVisible()">
        <span class="el-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="el-input__icon" v-if="suffixIcon" :class="suffixIcon"></i>
          </template>
          <i
            v-if="showClear"
            class="el-input__icon el-icon-circle-close el-input__clear"
            @mousedown.prevent
            @click="clear"
          ></i>
          <i
            v-if="showPwdVisible"
            class="el-input__icon el-icon-view el-input__clear"
            @click="handlePasswordVisible"
          ></i>
          <span v-if="isWordLimitVisible" class="el-input__count">
            <span class="el-input__count-inner"
              >{{ textLength }}/{{ upperLimit }}</span
            >
          </span>
        </span>
        <i
          class="el-input__icon"
          v-if="validateState"
          :class="['el-input__validateIcon', validateIcon]"
        ></i>
      </span>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="el-textarea__inner"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    ></textarea>
    <span
      v-if="isWordLimitVisible && type === 'textarea'"
      class="el-input__count"
      >{{ textLength }}/{{ upperLimit }}</span
    >
  </div>
</template>
<script>
// todo:
// 1. mixins 改成 use
// 2. elForm  elFormItem 注入 功能待测

import {
  reactive,
  toRefs,
  getCurrentInstance,
  toRef,
  onMounted,
  onUpdated,
  nextTick,
  watch,
  unref
} from 'vue'
import emitter from '../../src/mixins/emitter'
import { useEmitter } from '../../src/use/emitter'
import {
  useValidate,
  useTextarea,
  useInput,
  useInteractive,
  useStatusIcon
} from './use'

export default {
  name: 'ElInput',

  componentName: 'ElInput',

  mixins: [emitter],

  inheritAttrs: false,

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  emits: ['input', 'change', 'blur', 'clear', 'focus', 'update:modelValue'],

  setup(props, { attrs, emit, slots }) {
    const { dispatch } = useEmitter()

    const state = reactive({
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isComposing: false,
      passwordVisible: false
    })
    const { type, modelValue, validateEvent } = toRefs(props)
    const instance = getCurrentInstance()
    const { needStatusIcon } = useStatusIcon()
    const { validateState, validateIcon } = useValidate()
    const { textarea, textareaStyle, resizeTextarea } = useTextarea(
      toRefs(props),
      toRef(state, 'textareaCalcStyle')
    )
    const {
      input,
      inputSize,
      inputDisabled,
      nativeInputValue,
      textLength,
      upperLimit,
      isWordLimitVisible,
      inputExceed,
      showClear,
      showPwdVisible,
      getSuffixVisible
    } = useInput(
      toRefs(props),
      toRefs(state),
      instance,
      textarea,
      attrs,
      validateState,
      needStatusIcon,
      slots
    )

    const {
      focus,
      blur,
      select,
      setNativeInputValue,
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
    } = useInteractive(
      instance,
      input,
      textarea,
      toRefs(props),
      toRefs(state),
      nativeInputValue,
      emit,
      slots
    )

    // when change between <input> and <textarea>,
    // update DOM dependent value and styles
    // https://github.com/ElemeFE/element/issues/14857
    watch(
      () => unref(type),
      () => {
        nextTick(() => {
          setNativeInputValue()
          resizeTextarea()
          updateIconOffset()
        })
      }
    )
    watch(
      () => unref(modelValue),
      (val) => {
        nextTick(() => {
          setNativeInputValue()
          resizeTextarea()
        })
        if (unref(validateEvent)) {
          dispatch('el.form.change', val)
        }
      }
    )

    onMounted(() => {
      setNativeInputValue()
      resizeTextarea()
      updateIconOffset()
    })

    onUpdated(() => {
      nextTick(updateIconOffset)
    })

    return {
      ...toRefs(state),
      classProp: props.class,
      inputSize,
      validateState,
      validateIcon,
      inputDisabled,
      nativeInputValue,
      upperLimit,
      isWordLimitVisible,
      inputExceed,
      textLength,
      textarea,
      textareaStyle,
      getSuffixVisible,
      resizeTextarea,
      input,
      showClear,
      showPwdVisible,
      focus,
      blur,
      select,
      setNativeInputValue,
      handleBlur,
      handleFocus,
      handleInput,
      handleChange,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd,
      clear,
      handlePasswordVisible,
      updateIconOffset,
      needStatusIcon
    }
  },

  props: {
    modelValue: [String, Number],
    size: String,
    resize: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    class: String,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    tabindex: String
  }
}
</script>
