<template>
  <div
    :style="$attrs.style"
    :class="[
      inputSize ? 'el-input--' + inputSize : '',
      type === 'textarea' ? 'el-textarea' : 'el-input',
      {
        'is-disabled': $attrs.disabled,
        'is-exceed': inputExceed,
        'el-input-group': $slots.prepend || $slots.append,
        'el-input-group--append': $slots.append,
        'el-input-group--prepend': $slots.prepend,
        'el-input--prefix': $slots.prefix,
        'el-input--suffix':
          $slots.suffix ||
          $slots.suffixIcon ||
          $attrs.clearable ||
          $attrs.showPassword
      }
    ]"
  >
          <template v-if="type !== 'textarea'">
            <div class="el-input-group__prepend" v-if="$slots.prepend">
              <slot name="prepend"></slot>
            </div>
            <input
              class="el-input__inner"
              ref="input"
              v-bind="$attrs"
              @blur="onBlur"
              @focus="onFocus"
              @change="onChange"
              :type="showPassword ? (isVisiablePassword ? 'text' : 'password') : type"
              @input="handleInput"
            />
            <span class="el-input__prefix" v-if="prefixIcon">
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
                  @click.prevent="onClear"
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
          v-bind="$attrs"
          @input="onInput"
          @blur="onBlur"
          @focus="onFocus"
          @change="onChange"
        >
        </textarea>
        <span
          v-if="showWordLimit"
          class="el-input__count"
          >{{ modelValue.length }}/{{ $attrs.maxlength }}</span
        >
    </template>
   </div>
</template>
<script>
import {
  defineComponent,
  toRefs,
  toRef,
  watch,
  reactive,
  getCurrentInstance,
  onMounted,
  computed,
  nextTick
} from 'vue'
import {props} from './props'

import { useInput } from './use'

export default defineComponent({
  name: 'ElInput',

  componentName: 'ElInput',
  inheritAttrs: false,
  emits: ['blur', 'focus', 'change', 'input', 'clear', 'update:modelValue'],

  setup(props, cxt) {
    
    const state = reactive({
      isVisiablePassword: false
    })
   
    
    const { inputSize } = useInput(props, cxt)

     const {attrs, emit} = cxt
  
    const instance = getCurrentInstance()

    const {input, textarea, handleInput, upperLimit, textLength, clearValue, getSuffixVisible, nativeInputValue, focus, inputExceed} = useInput(props, cxt)

    const togglePassword = () => state.isVisiablePassword = !state.isVisiablePassword

    const onChange = (event) => {
      console.log('change', event.target.value)
        emit('change', nativeInputValue.value)
    }

    const onInput = (event) => { 
        handleInput(event)
    } 

   const onClear = () => {
      console.log('clear') 
      emit('update:modelValue', '')
      emit('clear')

      nextTick(() => console.log(props))
   }

   const onBlur = (event) => emit('blur', event)

   const onFocus = (event) => emit('focus', event)

    return {
      ...toRefs(state),
      focus,
      onBlur,
      handleInput,
      onFocus,
      togglePassword,
      onChange,
      getSuffixVisible,
      attrs,
      input,
      textarea,
      onClear,
      onInput,
      textLength,
      inputSize,
      ...toRefs(props),
      inputExceed
    }
  },

  props: props
})
</script>
