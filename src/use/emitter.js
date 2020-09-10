import { getCurrentInstance } from 'vue'
import mitt from 'mitt'

const emitter = mitt()

export function useEmitter() {
  const currentComponentInstance = getCurrentInstance()

  function on(type, handler) {
    const handleWrapper = (e) => {
      const { value, type, emitComponentInstance } = e
      if (type === 'broadcast') {
        if (isChildComponent(currentComponentInstance, emitComponentInstance)) {
          handler && handler(value)
        }
      } else if (type === 'dispatch') {
        if (isChildComponent(emitComponentInstance, currentComponentInstance)) {
          handler && handler(value)
        }
      } else {
        handler && handler(value)
      }
    }

    // Save the real handler because the need to call off
    handler.wrapper = handleWrapper
    emitter.on(type, handleWrapper)
  }

  function broadcast(type, evt) {
    emitter.emit(type, {
      type: 'broadcast',
      emitComponentInstance: currentComponentInstance,
      value: evt
    })
  }

  function dispatch(type, evt) {
    emitter.emit(type, {
      type: 'dispatch',
      emitComponentInstance: currentComponentInstance,
      value: evt
    })
  }

  function off(type, handler) {
    emitter.off(type, handler.wrapper)
  }

  function emit(type, evt) {
    emitter.emit(type, {
      value: evt
    })
  }

  return {
    on,
    broadcast,
    dispatch,
    off,
    emit
  }
}

/**
 * check componentChild is componentParent child components
 * @param {*} componentChild
 * @param {*} componentParent
 */
function isChildComponent(componentChild, componentParent) {
  const parentUId = componentParent.uid

  while (componentChild && componentChild?.parent?.uid !== parentUId) {
    componentChild = componentChild.parent
  }

  return Boolean(componentChild)
}
