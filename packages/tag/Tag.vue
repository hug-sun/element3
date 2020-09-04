<script>
import { computed, getCurrentInstance, Transition } from 'vue'
export default {
  name: 'ElTag',
  props: {
    type: {
      type: String,
      default: '',
      validator(val) {
        return ['success', 'info', 'warning', 'danger'].indexOf(val) !== -1
      }
    },
    closable: Boolean,
    disableTransitions: Boolean,
    hit: Boolean,
    color: String,
    size: {
      type: String,
      default: '',
      validator(val) {
        return ['medium', 'small', 'mini'].indexOf(val) !== -1
      }
    },
    effect: {
      type: String,
      default: 'light',
      validator(val) {
        return ['dark', 'light', 'plain'].indexOf(val) !== -1
      }
    }
  },
  setup(props, { emit, slots }) {
    const {
      type,
      closable,
      disableTransitions,
      hit,
      color,
      size,
      effect
    } = props

    const tagSize = computed(() => {
      return size || (getCurrentInstance().proxy.$ELEMENT || {}).size
    })
    const handleClose = (event) => {
      event.stopPropagation()
      emit('close', event)
    }
    const handleClick = (event) => {
      emit('click', event)
    }

    const classes = [
      'el-tag',
      type ? `el-tag--${type}` : '',
      tagSize.value ? `el-tag--${tagSize.value}` : '',
      effect ? `el-tag--${effect}` : '',
      hit && 'is-hit'
    ]
    const tagEl = (
      <span
        class={classes}
        style={{ backgroundColor: color }}
        onClick={handleClick}
      >
        {slots.default && slots.default()}
        {closable && (
          <i class="el-tag__close el-icon-close" onClick={handleClose}></i>
        )}
      </span>
    )
    return () =>
      disableTransitions ? (
        tagEl
      ) : (
        <Transition name="el-zoom-in-center">{tagEl}</Transition>
      )
  }
}
</script>
