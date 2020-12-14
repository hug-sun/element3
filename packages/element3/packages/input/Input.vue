<template>
   <div :style="$attrs.style" 
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
              $slots.suffix || $slots.suffixIcon || $attrs.clearable || $attrs.showPassword
            }
       ]"
    > 
        <InputText v-if="type !== 'textarea'" 
             v-bind="$attrs" 
             :type="type" 
             :onEventHanlder="onEventHanlder"
         > 
             <template v-slot:prepend v-if="$slots.prepend">
                   <slot name="prepend"></slot>
             </template>
             <template v-slot:prefix v-if="$slots.prefix">
                   <slot name="prefix"></slot>
             </template>
              <template v-slot:suffix v-if="$slots.suffix">
                   <slot name="suffix"></slot>
             </template>
              <template v-slot:append v-if="$slots.append">
                   <slot name="append"></slot>
             </template>
         </InputText>
        <InputTextArea v-else 
           v-bind="$attrs"
          :onEventHanlder="onEventHanlder"
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
        </InputTextArea>
   </div>
</template>
<script>

import {defineComponent, toRefs, toRef, watch, reactive, getCurrentInstance, onMounted, computed} from 'vue'
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
    
    const {inputSize} = useInput(props, cxt)

    const inputLenght
    
    const onEventHanlder = (type, event) =>  cxt.emit(type, event) 

    return {
      inputSize,
      onEventHanlder,
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
