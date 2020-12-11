<script lang="jsx">
import {
  computed,
  ref,
  onMounted,
  onUpdated,
  onBeforeUnmount,
  inject,
  watch,
  unref
} from 'vue'

export default {
  props: {
    isAutoWidth: Boolean,
    updateAll: Boolean
  },
  setup(props, { slots }) {
    const { labelStyle, labelRef } = useLabelWidth(props, slots)

    return () => {
      if (!slots.default) return null
      if (props.isAutoWidth) {
        return (
          <div
            ref={labelRef}
            class="el-form-item__label-wrap"
            style={labelStyle}
          >
            {slots.default()}
          </div>
        )
      } else {
        return slots.default()
      }
    }
  }
}

function useLabelWidth(props, slots) {
  const computedWidth = ref(0)
  const labelRef = ref(null)
  const _elForm = inject('elForm')
  const _elFormItem = inject('elFormItem')

  const getLabelWidth = () => {
    const $el = unref(labelRef)
    if ($el && $el.firstElementChild) {
      const { width } = window.getComputedStyle($el.firstElementChild)
      return Math.ceil(parseFloat(width))
    } else {
      return 0
    }
  }

  const updateLabelWidth = (action = 'update') => {
    const $el = unref(labelRef)
    if (slots.default && props.isAutoWidth && $el.firstElementChild) {
      if (action === 'update') {
        computedWidth.value = getLabelWidth()
      } else if (action === 'remove') {
        _elForm.deregisterLabelWidth(unref(computedWidth))
      }
    }
  }

  watch(computedWidth, (val, oldVal) => {
    if (props.updateAll) {
      _elForm.registerLabelWidth(val, oldVal)
      _elFormItem.updateComputedLabelWidth(val)
    }
  })

  const labelStyle = computed(() => {
    const autoLabelWidth = _elForm.autoLabelWidth
    const style = {}
    if (autoLabelWidth && autoLabelWidth !== 'auto') {
      const marginLeft = parseInt(autoLabelWidth, 10) - unref(computedWidth)
      if (marginLeft) {
        style.marginLeft = marginLeft + 'px'
      }
    }
    return style
  })

  onMounted(() => {
    updateLabelWidth('update')
  })

  onUpdated(() => {
    updateLabelWidth('update')
  })

  onBeforeUnmount(() => {
    updateLabelWidth('remove')
  })

  return {
    labelStyle,
    labelRef
  }
}
</script>
