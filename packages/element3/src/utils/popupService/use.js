import { computed, onBeforeMount, onUnmounted, ref } from 'vue'
import { addClass, removeClass, hasClass } from '../dom'

let zIndex = 2000

let useBodyScrollCounter = 0

function useZindex() {
  return computed(() => zIndex++)
}

export const useStyle = () => {
  const style = ref({})

  function setStyle(options) {
    style.value = Object.assign({}, style, options)
  }
  return {
    style,
    setStyle
  }
}

function useBodyScroll({ lockScroll }) {
  const body = document.body

  useBodyScrollCounter++
  onBeforeMount(() => {
    if (lockScroll && !hasClass(body, 'el-popup-parent--hidden')) {
      addClass(body, 'el-popup-parent--hidden')
    }
  })

  onUnmounted(() => {
    useBodyScrollCounter--
    if (lockScroll || useBodyScrollCounter <= 1) {
      removeClass(document.body, 'el-popup-parent--hidden')
    }
  })
}

export { useZindex, useBodyScroll }
