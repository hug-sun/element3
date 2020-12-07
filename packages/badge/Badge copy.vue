<template>
  <div class="el-badge">
    <slot></slot>
    <transition name="el-zoom-in-center">
      <sup
        v-show="!hidden && (content || content === 0 || isDot)"
        v-text="content"
        class="el-badge__content"
        :class="[
          'el-badge__content--' + type,
          {
            'is-fixed': $slots.default,
            'is-dot': isDot
          }
        ]"
      >
      </sup>
    </transition>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'

export default {
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
    const { isDot, max, value } = toRefs(props)
    const content = useContent(isDot, max, value)

    return {
      content
    }
  }
}

const useContent = (isDot, max, value) => {
  const content = computed(() => {
    if (isDot.value) return

    if (
      max &&
      typeof value.value === 'number' &&
      typeof max.value === 'number'
    ) {
      return max.value < value.value ? `${max.value}+` : value.value
    }

    return value.value
  })

  return content
}
</script>
