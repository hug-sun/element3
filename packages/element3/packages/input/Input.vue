<template>
   <div :style="$attrs.style" :class="[
       inputSize ? 'el-input--' + inputSize : ''
   ]"> 
        <InputText v-if="type !== 'textarea'" 
             v-bind="$attrs" 
             :type="type" 
             :onBlurHanlder="onBlurHanlder"
             :onFocusHanlder="onFocusHanlder"
             :onChangeHanlder="onChangeHanlder"
             :onInputHanlder="onInputHanlder"
             :onClearHanlder="onClearHanlder"
        > 
             <template v-slot:prepend>
                   <slot name="prepend"></slot>
             </template>
             <template v-slot:prefix>
                   <slot name="prefix"></slot>
             </template>
              <template v-slot:suffix>
                   <slot name="suffix"></slot>
             </template>
              <template v-slot:append>
                   <slot name="append"></slot>
             </template>
         </InputText>
        <InputTextArea v-else v-bind="$attrs"/>
   </div>
</template>
<script>

import {defineComponent, toRefs, toRef, watch, reactive, getCurrentInstance, onMounted} from 'vue'
import InputText from './InputText.vue'
import InputTextArea from './InputTextArea.vue'
import {useInput} from './use'

export default defineComponent({
  name: 'ElInput',
  
  componentName: 'ElInput',
  
  components: {
    InputText,
    InputTextArea
  },

  inheritAttrs: false,
  emits: ['blur', 'focus', 'change', 'input', 'clear'],
 
  setup(props, cxt) {
    
    const instance = getCurrentInstance()
    
    const {inputSize} = useInput(props, instance, cxt)
    
    const onBlurHanlder = (event) =>  cxt.emit('blur', event) 

    const onFocusHanlder = (event) =>  cxt.emit('focus', event) 

    const onChangeHanlder = (value) => cxt.emit('change', value)

    const onInputHanlder = (value) => cxt.emit('input', value)

    const onClearHanlder = (value) => cxt.emit('clear')

    return {
      onBlurHanlder,
      onFocusHanlder,
      onChangeHanlder,
      onInputHanlder,
      onClearHanlder,
      inputSize,
       ...toRefs(props),
    }
  },

  props: {
     type: {
       type: String,
       default: 'text'
     },
     size: {
      type: String,
      validator: function (value) {
          return ['medium', 'small', 'mini'].includes(value)
      }
    }
  }
})

</script>
