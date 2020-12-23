<template>
  <div :style="$attrs.style" :class="classes">
    <template v-if="type !== 'textarea'">
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        class="el-input__inner"
        ref="input"
        v-bind="$attrs"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="onChange"
        :type="showPassword ? (isVisiablePassword ? 'text' : 'password') : type"
        @input="handleInput"
      />
      <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="el-input__icon" v-if="prefixIcon" :class="prefixIcon"></i>
      </span>
      <span class="el-input__suffix" v-if="getSuffixVisible">
        <span class="el-input__suffix-inner">
          <template v-if="!clearable || !showPassword || !showWordLimit">
            <slot name="suffix"></slot>
            <i class="el-input__icon" v-if="suffixIcon" :class="suffixIcon"></i>
          </template>
          <i
            v-if="clearable"
            class="el-input__icon el-icon-circle-close el-input__clear"
            @mousedown.prevent
            @click.prevent="handleClear"
          ></i>

          <i
            v-if="showPassword"
            class="el-input__icon el-icon-view el-input__clear"
            @mousedown.prevent
            @click.prevent="togglePassword"
          ></i>

          <span v-if="showWordLimit" class="el-input__count">
            <span class="el-input__count-inner"
              >{{ textLength }}/{{ $attrs.maxlength }}</span
            >
          </span>
        </span>
      </span>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <template v-else>
      <textarea
        class="el-textarea__inner"
        ref="textarea"
        :style="textareaStyle"
        v-bind="$attrs"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="onChange"
      >
      </textarea>
      <span v-if="showWordLimit" class="el-input__count"
        >{{ modelValue.length }}/{{ $attrs.maxlength }}</span
      >
    </template>
  </div>
</template>
<script>
import { defineComponent, toRef, reactive } from 'vue'
import { props } from './props'

import {
  useInput,
  useTextarea,
  useInputMethod,
  useInputEvent,
  useClass
} from './use'

export default defineComponent({
  name: 'ElInput',
  inheritAttrs: false,
  props: props,
  emits: ['blur', 'focus', 'change', 'input', 'clear', 'update:modelValue'],

  setup(props, cxt) {
    const state = reactive({
      isVisiablePassword: false
    })

    const { inputSize } = useInput(props, cxt)

    const { attrs, emit } = cxt

    const { textarea, textareaStyle } = useTextarea(props)

    const {
      input,
      textLength,
      getSuffixVisible,
      inputExceed,
      getInput
    } = useInput(props, cxt, textarea)

    const classes = useClass(
      inputSize,
      inputExceed,
      props,
      cxt.attrs,
      cxt.slots
    )
    const {
      handleInput,
      handleFocus,
      handleBlur,
      handleClear,
      onChange
    } = useInputEvent(emit)

    const { focus, select, blur } = useInputMethod(getInput())

    const togglePassword = () =>
      (state.isVisiablePassword = !state.isVisiablePassword)

    return {
      isVisiablePassword: toRef(state, 'isVisiablePassword'),
      focus,
      select,
      blur,
      handleBlur,
      handleInput,
      handleFocus,
      togglePassword,
      onChange,
      getSuffixVisible,
      attrs,
      input,
      textarea,
      handleClear,
      textLength,
      textareaStyle,
      classes
    }
  }
})
</script>
