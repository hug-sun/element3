import { once, on } from '../utils/dom'

const INTERVAL_TIME = 100
export default {
  beforeMount(el, binding) {
    let startTime
    let intervalId

    const callHandler = () => binding.value && binding.value()

    const clearIntervalHandler = () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    const isMainKey = (e) => {
      // 0：主按键，通常指鼠标左键或默认值
      return e.button === 0
    }

    const handleMouseup = () => {
      if (Date.now() - startTime < INTERVAL_TIME) {
        callHandler()
      }
      clearIntervalHandler()
    }

    const handleMousedown = (e) => {
      if (!isMainKey(e)) return
      startTime = Date.now()
      once(document, 'mouseup', handleMouseup)
      clearIntervalHandler()
      intervalId = setInterval(callHandler, INTERVAL_TIME)
    }

    on(el, 'mousedown', handleMousedown)
  }
}
