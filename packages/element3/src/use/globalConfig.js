import { getCurrentInstance } from 'vue'

/**
 * get globalOptions $ELEMENT config object
 */
export function useGlobalOptions() {
  const instance = getCurrentInstance()

  if (!instance) {
    console.warn('useGlobalOptions must be call in setup function')
    return
  }

  return instance.appContext.config.globalProperties.$ELEMENT || {}
}

export function setupGlobalOptions(opts = {}) {
  return (app) => {
    app.config.globalProperties.$ELEMENT = {
      size: opts.size || '',
      zIndex: opts.zIndex || 2000
    }
  }
}
