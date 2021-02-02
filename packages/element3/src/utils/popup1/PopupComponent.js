import { Teleport, ref, Transition, computed, defineComponent } from 'vue'
import { props } from './props'
import { useZindex, useBodyScroll } from './use'

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
const PopupComponent = (component, componentProps, children) =>
  defineComponent({
    props,
    emits: ['close'],
    setup(props) {
      const show = ref(true)

      const showTeleport = ref(true)

      const zIndex = useZindex()

      useBodyScroll(props)

      const popup = ref(null)

      const { style, setStyle } = useStyle()

      const afterLeaveHandler = () => {
        showTeleport.value = false
      }
      const closePopup = () => {
        show.value = false
      }

      return {
        zIndex,
        show,
        closePopup,
        style,
        setStyle,
        popup,
        showTeleport,
        afterLeaveHandler
      }
    },
    render({
      $props,
      $attrs,
      zIndex,
      closePopup,
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
              onClick={closePopup}
              onClose={closePopup}
              style={styleText}
              {...$attrs}
              {...componentProps}
            >
              {children ? <children /> : null}
            </component>
          </Transition>
        </Teleport>
      )
    }
  })

export default PopupComponent
