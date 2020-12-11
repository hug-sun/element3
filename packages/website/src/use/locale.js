import { t } from '../locale'
import { getCurrentInstance } from 'vue'

function useLocale() {
  return function (...args) {
    const instance = getCurrentInstance()
    return t.apply(instance, args)
  }
}
export { useLocale }
