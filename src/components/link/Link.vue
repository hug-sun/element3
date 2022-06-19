<script setup lang="ts">
import { computed, withDefaults } from 'vue'
type LinkType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

interface LinkProps {
  type?: LinkType
  underline?: boolean
  disabled?: boolean
  href?: string
  icon?: string
}

const props = withDefaults(defineProps<LinkProps>(), {
  type: 'default',
  underline: true,
  disabled: false,
})

function useClasses(props) {
  return computed(() => {
    return [
      'el-link',
      props.type ? `el-link--${props.type}` : '',
      props.underline && !props.disabled && 'is-underline',
      props.disabled && 'is-disabled',
    ]
  })
}
const classes = useClasses(props)
</script>

<template>
  <a
    :class="classes"
    :href="disabled ? null : href"
  >
    <i v-if="icon" :class="icon" />
    <span v-if="$slots.default" class="el-link--inner">
      <slot />
    </span>
  </a>
</template>

<style lang="scss">
@import "../../theme/src/link.scss";
</style>
