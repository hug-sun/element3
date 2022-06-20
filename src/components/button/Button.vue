<script lang="ts" setup>
import { computed } from 'vue'

// 按钮类型
type buttonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
type buttonSize = 'medium' | 'small' | 'mini'

interface ButtonProps {
  type?: buttonType
  size?: buttonSize
  round?: boolean
  plain?: boolean
}

const props = defineProps<ButtonProps>()

function useClasses(props) {
  return computed(() => {
    return [
      props.type ? `el-button--${props.type}` : '',
      props.size ? `el-button--${props.size}` : '',
      {
        'is-round': props.round,
        'is-plain': props.plain,
      },
    ]
  })
}
const classes = useClasses(props)
</script>

<template>
  <!-- props size  medium / small / mini -->
  <button class="el-button" :class="classes" type="button">
    <span v-if="$slots.default">
      <slot />
    </span>
  </button>
</template>

<style lang="scss">
@import "../../theme/src/button.scss";
</style>
