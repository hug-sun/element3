import { ref, unref, computed, watch, nextTick, toRefs, onUpdated, inject } from "vue"
import { dispatch } from '../../src/use/emitter'

export const useInput = (props, instance, cxt) => { 

    const elFormItem = inject('elFormItem', {})

    const input = ref(null);

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
  
    const getInput = () => { 
      return unref(input) 
    }

    const clearValue = () => {
       cxt.emit('update:modelValue', '')
    }

    const setNativeInputValue = (value) => {
      const input = getInput()
  
      if (!input) return
      input.value = unref(nativeInputValue)
    }

    const handleInput = async (event) => {  
      cxt.emit('update:modelValue', event.target.value)
      cxt.emit('input', event.target.value)
     
      await nextTick()
      setNativeInputValue(event.target.value)
   }

    const upperLimit = computed(() => {
      return Number(cxt.attrs.maxlength)
    })

    const getSuffixVisible = computed(() => {
        return suffixIcon?.value ||  clearable?.value || showPassword?.value || showWordLimit?.value
    })

    watch(() => props.modelValue, () => { 
       if (props.validateEvent) {
         elFormChange()
       }
    })

    return {
      input,
      nativeInputValue,
      textLength,
      upperLimit,
      handleInput,
      clearValue,
      inputSize,
      getSuffixVisible
    }
}

