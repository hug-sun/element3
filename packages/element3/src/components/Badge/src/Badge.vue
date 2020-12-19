<template>
  <div class="el-badge">
    <slot></slot>
    <transition name="el-zoom-in-center">
      <sup
        v-if="isShow"
        class="el-badge__content"
        v-text="badgeNumber"
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
import { defineComponent, computed } from 'vue'
import { isString } from '../../../utils/types'

export default defineComponent({
  name: 'ElBadge',

  props: {
    value: [String, Number],
    max: Number,
    isDot: Boolean,
    hidden: Boolean,
    type: {
      type: String,
      default: 'danger',
      validator(val) {
        return ['primary', 'success', 'warning', 'info', 'danger'].includes(val)
      }
    }
  },

  setup(props) {
    const badgeNumber = useBadgeNumber(props)
    const isShow = useShow(props)
    return {
      badgeNumber,
      isShow
    }
  }
})

const useBadgeNumber = (props) => {
  return computed(() => {
    if (!props.max || isString(props.value)) {
      return props.value
    }

    if (props.value <= props.max) {
      return props.value
    }

    return `${props.max}+`
  })
}

const useShow = (props) => {
  return computed(() => {
    if (props.hidden) {
      return false
    }
    if (props.value == 0) {
      return false
    }
    return true
  })
}
</script>
