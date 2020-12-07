<template>
  <div class="el-badge">
    <slot></slot>
    <transition name="el-zoom-in-center">
      <sup
        v-if="showStatus"
        class="el-badge__content"
        v-text="number"
        :class="[
          'el-badge__content--' + type,
          {
            'is-fixed': $slots.default,
            'is-dot': isDot
          }
        ]"
      ></sup>
    </transition>
  </div>
</template>

<script>
import { defineComponent, computed, toRefs } from 'vue'
import { isString } from '../../src/utils/types'

export default defineComponent({
  name: 'ElBadge',

  props: {
    value: [String, Number],
    max: Number,
    isDot: Boolean,
    hidden: Boolean,
    type: {
      type: String,
      default: 'primary',
      validator(val) {
        return (
          ['primary', 'success', 'warning', 'info', 'danger'].indexOf(val) > -1
        )
      }
    }
  },

  setup(props) {
    const number = useNumber(props)
    const showStatus = useShowStatus(props)
    return {
      number,
      showStatus,
      ...toRefs(props)
    }
  }
})

const useNumber = (props) => {
  return computed(() => {
    if (!props.max) {
      return props.value
    }

    if (isString(props.value)) {
      return props.value
    }

    if (props.value <= props.max) {
      return props.value
    }

    return `${props.max}+`
  })
}

const useShowStatus = (props) => {
  if (props.hidden) {
    return false
  }

  if (props.value == 0) {
    return false
  }

  return true
}
</script>
