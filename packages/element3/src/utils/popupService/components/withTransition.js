import { h, Transition, defineComponent } from 'vue'

export default function withTransition(component) {
  return function (props, context) {
    const { transitionClass } = props
    if (!transitionClass) {
      return <component {...props} {...context.attrs} />
    }

    return (
      <Transition
        name={transitionClass}
        onAfterLeave={props.afterLeaveHandler}
        appear
      >
        <component {...props} {...context.attrs} />
      </Transition>
    )
  }
}
