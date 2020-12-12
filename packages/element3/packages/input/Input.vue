<template>
   <div :style="$attrs.style" :class="[
       inputSize ? 'el-input--' + inputSize : ''
   ]"> 
        <InputText v-if="type !== 'textarea'" v-bind="$attrs" :type="type"> 
             <template v-slot:prepend>
                   <slot name="prepend"></slot>
             </template>
             <template v-slot:prefix>
                   <slot name="prefix"></slot>
             </template>
              <template v-slot:suffix>
                   <slot name="suffix"></slot>
             </template>
         </InputText>
        <InputTextArea v-else v-bind="$attrs"/>
   </div>
</template>
<script>

import {defineComponent, toRefs, toRef, watch, reactive, getCurrentInstance} from 'vue'
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

  setup(props, cxt) {
   
    const instance = getCurrentInstance()
    const {inputSize} = useInput(props, instance, cxt)
    return {
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
