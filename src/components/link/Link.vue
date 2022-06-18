<script setup lang="ts">
import { computed } from 'vue'
type LinkType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

interface LinkProps {
  type?: LinkType
}

const props = defineProps<LinkProps>()

function useClasses(props) {
  return computed(() => {
    return [
      props.type ? `el-link--${props.type}` : 'el-link--default',
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
