<template>
    <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
    </div>
    <input class="el-input__inner" 
        ref="input" 
        v-bind="$attrs" 
        @blur="handleBlur"
        :type="showPassword ? (isVisiablePassword ? 'text' : 'password'): type" 
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
            @click="clearValue"
          ></i>
         
          <i
            class="el-input__icon el-icon-view el-input__clear"
            @mousedown.prevent
            @click="togglePassword"
          ></i>
         
         <span v-if="showWordLimit" class="el-input__count">
            <span class="el-input__count-inner"
              >{{ textLength }}/{{ upperLimit }}</span
            >
         </span>
          
        </span>
      </span>
       <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
</template>
<script>

import {defineComponent, toRefs, getCurrentInstance, toRef, reactive, inject} from 'vue'
import {useInput} from './use'
import {props as InputProps} from './inputTextProps'

export default defineComponent({
  name: 'InputText',

  componentName: 'InputText',
  inheritAttrs: true,
  
  setup(props, cxt) {
  
   const {showWordLimit} = toRefs(props)

   const state = reactive({
      isVisiablePassword: false
   })
   const {attrs, emit} = cxt
   const instance = getCurrentInstance()
   const {input, handleInput, upperLimit, textLength, clearValue, getSuffixVisible} = useInput(props, instance, cxt)

   const togglePassword = () => state.isVisiablePassword = !state.isVisiablePassword

   const handleBlur = (event) => { 
      props.onBlurHanlder(event)
   }
 
   return {
     ...toRefs(props),
     ...toRefs(state),
     togglePassword,
     getSuffixVisible,
     attrs,
     input,
     clearValue,
     handleInput,
     upperLimit,
     textLength,
     showWordLimit,
     handleBlur
   }
  },
  props: InputProps
})

</script>
