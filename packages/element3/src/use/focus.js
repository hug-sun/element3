import { getCurrentInstance, isRef } from 'vue'

function useFocus(ref) {
  return function focus() {
    if (isRef(ref)) {
      ref.value.focus()
    } else {
      const { ctx } = getCurrentInstance()
      ctx.$refs[ref].focus()
    }
  }
}

export default useFocus
