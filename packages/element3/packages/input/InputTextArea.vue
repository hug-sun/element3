<template>
    <textarea 
      class="el-textarea__inner" 
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
      >{{ modelValue.length }}/{{ maxlength }}</span
    >
</template>
<script>
import { useInput } from './use'
import {defineComponent, onUpdated} from 'vue'
export default defineComponent({
  name: 'InputTextArea',

  componentName: 'InputTextArea',

  inheritAttrs: true,

  emits: ['blur', 'focus', 'change', 'input'],

  setup(props, cxt) {
    
    const {handleInput, nativeInputValue} = useInput(props, cxt)

    const onBlur = (event) => props.onEventHanlder('blur', event)

    const onFocus = (event) => props.onEventHanlder('focus', event)

    const onChange = (event) => props.onEventHanlder('change', nativeInputValue.value)

    const onInput = (event) => {
      handleInput(event)
      props.onEventHanlder('input', nativeInputValue.value)
    }
   
    return {
       onBlur,
       onFocus,
       onChange,
       onInput
    }
  },
  props: {
    showWordLimit: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: String,
      default: "0"
    },
    modelValue: {
      type: [String, Number]
    },
    prefixIcon: {
      type: String
    },
    suffixIcon: {
      type: String
    },
    onEventHanlder: {
      type: Function
    }
  }
})
</script>
