<script lang="jsx">
import { useGlobalOptions } from '../../../composables/globalConfig.js'
import { ref, computed, toRefs, Transition } from 'vue'

const useShow = (emit) => {
  const show = ref(true)

  const handleClose = (e) => {
    e.stopPropagation()
    show.value = false
    emit('close', e)
  }

  return {
    show,
    handleClose
  }
}
export default {
  name: 'ElTag',
  props: {
    type: {
      type: String,
      default: '',
      validator(v) {
        return ['success', 'info', 'warning', 'danger', ''].includes(v)
      }
    },
    closable: Boolean,
    disableTransitions: Boolean,
    hit: Boolean,
    color: String,
    size: {
      type: String,
      validator(v) {
        return ['medium', 'small', 'mini', ''].includes(v)
      }
    },
    effect: {
      type: String,
      default: 'light',
      validator(v) {
        return ['dark', 'light', 'plain'].includes(v)
      }
    }
  },
  emits: ['close', 'click'],
  setup(props, { emit }) {
    const $ELEMENT = useGlobalOptions()

    const { type, hit, size, effect } = toRefs(props)

    const tagSize = computed(() => {
      return size?.value || $ELEMENT.size
    })
    const classes = computed(() => [
      'el-tag',
      type.value ? `el-tag--${type.value}` : '',
      tagSize.value ? `el-tag--${tagSize.value}` : '',
      `el-tag--${effect.value}`,
      hit.value && 'is-hit'
    ])

    const { show, handleClose } = useShow(emit)

    return {
      show,
      classes,
      handleClose
    }
  },
  render() {
    const tagEl = this.show ? (
      <span
        class={this.classes}
        style={{ backgroundColor: this.color }}
        onClick={(e) => {
          this.$emit('click', e)
        }}
      >
        {this.$slots.default?.()}
        {this.closable && (
          <i class="el-tag__close el-icon-close" onClick={this.handleClose} />
        )}
      </span>
    ) : (
      ''
    )
    return this.disableTransitions ? (
      tagEl
    ) : (
      <Transition appear name="el-zoom-in-center">
        {tagEl}
      </Transition>
    )
  }
}
</script>
