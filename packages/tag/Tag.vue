<script lang="jsx">
import { computed, getCurrentInstance, Transition } from 'vue'
export default {
  name: 'ElTag',
  props: {
    text: String,
    closable: Boolean,
    type: String,
    hit: Boolean,
    disableTransitions: Boolean,
    color: String,
    size: String,
    effect: {
      type: String,
      default: 'light',
      validator(val) {
        return ['dark', 'light', 'plain'].indexOf(val) !== -1
      }
    }
  },
  emits: ['close', 'click'],
  setup(props, { emit, slots }) {
    const tagSize = computed(() => {
      return props.size || (getCurrentInstance().proxy.$ELEMENT || {}).size
    })
    const handleClose = (event) => {
      event.stopPropagation()
      emit('close', event)
    }
    const handleClick = (event) => {
      emit('click', event)
    }
    return () => {
      const classes = [
        'el-tag',
        props.type ? `el-tag--${props.type}` : '',
        tagSize.value ? `el-tag--${tagSize.value}` : '',
        props.effect ? `el-tag--${props.effect}` : '',
        props.hit && 'is-hit'
      ]
      const tagEl = (
        <span
          class={classes}
          style={{ backgroundColor: props.color }}
          onClick={handleClick}
        >
          {slots.default && slots.default()}
          {props.closable && (
            <i class="el-tag__close el-icon-close" onClick={handleClose}></i>
          )}
        </span>
      )
      return props.disableTransitions ? (
        tagEl
      ) : (
        <Transition name="el-zoom-in-center">{tagEl}</Transition>
      )
    }
  }
}
</script>
