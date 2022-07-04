<script setup lang="ts">
import { computed } from 'vue'
import { isString } from '../../utils/types'

type BadgeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  value?: String | Number
  max?: Number
  isDot?: Boolean
  hidden?: Boolean
  type?: BadgeType
}

const props = withDefaults(defineProps<BadgeProps>(), {
  type: 'danger',
})

function useBadgeContent(props) {
  return computed(() => {
    if (!props.max || isString(props.value))
      return props.value

    if (props.value <= props.max)
      return props.value

    return `${props.max}+`
  })
}

const badgeContent = useBadgeContent(props)

function useShow(props) {
  return computed(() => {
    if (props.hidden)
      return false

    if (props.value === 0)
      return false

    return true
  })
}

const isShow = useShow(props)
</script>

<template>
  <div class="el-badge">
    <slot />
    <sup
      v-if="isShow" class="el-badge__content" :class="[
        `el-badge__content--${type}`,
        {
          'is-dot': isDot,
          'is-fixed': $slots.default,
        },
      ]" v-text="badgeContent"
    />
  </div>
</template>

<style lang="scss">
@import '../../theme/src/badge.scss';
</style>
