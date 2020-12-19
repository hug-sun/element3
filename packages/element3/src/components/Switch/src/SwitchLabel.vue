<template>
  <span v-if="iconClass || text" :class="classes">
    <i :class="[iconClass]"></i>
    <span v-if="!iconClass">{{ text }}</span>
  </span>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const classes = useClasses(props)
    return {
      classes
    }
  }
}
const useClasses = (props) => {
  return computed(() => {
    return [
      'el-switch__label',
      props && props.type ? `el-switch__label--${props && props.type}` : '',
      {
        'is-active': props && props.active
      }
    ]
  })
}
</script>
