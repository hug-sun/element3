
import { computed, getCurrentInstance, inject, unref } from 'vue'


export const useInputSize = (size) => {
    const elFormItem = inject('elFormItem', {})
    const _elFormItemSize = computed(() => {
        return unref(elFormItem.elFormItemSize)
    })
    const inputSize = computed(() => {
        return size || unref(_elFormItemSize) || (getCurrentInstance().proxy.$ELEMENT || {}).size;
    })
    return inputSize
}

export const useValidate = () => {
    const elFormItem = inject('elFormItem', "")
    const validateState = computed(() => {
        return elFormItem ? elFormItem.validateState : "";
    })
    const validateIcon = computed(() => {
        return {
            validating: "el-icon-loading",
            success: "el-icon-circle-check",
            error: "el-icon-circle-close",
        }[unref(validateState)];
    })

    return { validateState, validateIcon }
}

export const useInputDisabled = (disabled) => {
    const elForm = inject('elForm', {})
    return computed(() => {
        return disabled || unref(elForm.disabled)
    })
}