import { ref, unref, computed, watch, nextTick, toRefs, inject, onMounted } from "vue"


export const useInput = (props, cxt) => { 

    const elFormItem = inject('elFormItem', {})

    const input = ref(null);

    const textarea = ref(null)

    const elFormChange = inject('elForm.change', () => {})
    
    const { modelValue, size, suffixIcon, clearable, showPassword, showWordLimit } = toRefs(props)

    const nativeInputValue = computed(() => {
      return modelValue.value === null || modelValue.value === undefined
        ? ''
        : String(modelValue.value)
    })

    const textLength = computed(() => {
      if (typeof modelValue.value === 'number') {
        return String(modelValue.value).length
      }
  
      return (modelValue.value || '').length
    })

    const elFormItemSize = computed(() => {
         return elFormItem.elFormItemSize || 'medium'
    })

    const inputSize = computed(() => {
        return size?.value || elFormItemSize.value 
    })

    const inputExceed = computed(() => {
        return props.modelValue?.length > Number(cxt.attrs.maxlength) ? true : false
    })
  
    const getInput = () => { 
      return input.value || textarea.value
    }

    const focus = () => {
      getInput().focus()
    }

    const clearValue = () => {
       cxt.emit('update:modelValue', '')
    }

    const setNativeInputValue = () => {
      const input = getInput()
  
      if (!input) return
      input.value = unref(nativeInputValue)
    }

    const handleInput = async (event) => {   console.log('input', event.target.value)
      cxt.emit('update:modelValue', event.target.value)
    //  cxt.emit('input', event.target.value)
      await nextTick()
      setNativeInputValue(event.target.value)
   }

    const getSuffixVisible = computed(() => {
        return suffixIcon?.value ||  clearable?.value || showPassword?.value || showWordLimit?.value
    })

    watch(() => props.modelValue, () => { 
       setNativeInputValue() 
       if (props.validateEvent) {
           elFormChange()
       }
    })

    // onMounted(() => {
    //   //  props.modelValue && setNativeInputValue()
    // })

    return {
      input,
      textarea,
      focus,
      nativeInputValue,
      textLength,
      handleInput,
      clearValue,
      inputSize,
      getSuffixVisible,
      inputExceed
    }
}

