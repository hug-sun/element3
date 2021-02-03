import {
  Teleport,
  ref,
  Transition,
  getCurrentInstance,
  computed,
  defineComponent
} from 'vue'
import { props } from './props'
import { useZindex, useBodyScroll } from './use'
import { getRefInstance } from '../../utils/util'

const useStyle = () => {
  const style = ref({})

  function setStyle(options) {
    style.value = Object.assign({}, style, options)
  }
  return {
    style,
    setStyle
  }
}

const omit = (obj, keys) => {
  const ret = Object.assign({}, obj)

  keys.forEach((key) => delete ret[key])

  return ret
}

const PopupComponent = (component, children) =>
  defineComponent({
    props,
    //emits: ['close'],
    setup(props, { slots }) {
      const show = ref(true)

      const instance = getCurrentInstance()

      const showTeleport = ref(true)

      const zIndex = useZindex()

      useBodyScroll(props)

      const popup = ref(null)

      const { style, setStyle } = useStyle()

      const afterLeaveHandler = () => {
        showTeleport.value = false
      }

      const handleClick = () => {
        show.value = false

        props.onClose && props.onClose(getRefInstance(instance, 'popup')[0])
      }
      const closePopup = (instance) => {
        show.value = false
        props.onClose && props.onClose(instance)
      }

      return {
        zIndex,
        show,
        closePopup,
        style,
        setStyle,
        popup,
        showTeleport,
        handleClick,
        afterLeaveHandler
      }
    },
    render({
      $props,
      $attrs,
      zIndex,
      closePopup,
      handleClick,
      style,
      popup,
      show,
      showTeleport,
      afterLeaveHandler
    }) {
      const styleText = { ...style, zIndex }

      if (!showTeleport) {
        return null
      }

      const childernProps = omit($props, ['onClose'])

      return (
        <Teleport to="body">
          <Transition
            name={$props.transitionClass}
            onAfterLeave={afterLeaveHandler}
            appear
          >
            <component
              v-show={show}
              ref="popup"
              onClick={handleClick}
              onClose={closePopup}
              style={styleText}
              {...$attrs}
              {...childernProps}
            >
              {children ? <children /> : null}
            </component>
          </Transition>
        </Teleport>
      )
    }
  })

export default PopupComponent
