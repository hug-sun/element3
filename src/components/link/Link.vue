<script setup lang="ts">
import { computed, withDefaults } from 'vue'
type LinkType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

interface LinkProps {
  type?: LinkType
  underline?: boolean
}

const props = withDefaults(defineProps<LinkProps>(), {
  underline: true,
})

function useClasses(props) {
  return computed(() => {
    return [
      props.type ? `el-link--${props.type}` : 'el-link--default',
      props.underline && 'is-underline',
    ]
  })
}
const classes = useClasses(props)
</script>

<template>
  <a class="el-link" :class="classes" role="a">
    <span v-if="$slots.default" class="el-link--inner">
      <slot />
    </span>
  </a>
</template>

<style lang="scss">
@import "../../theme/src/link.scss";
</style>
