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
      type: String
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
      props.type ? `el-switch__label--${props.type}` : '',
      'el-switch__label',
      {
        'is-active': props.active
      }
    ]
  })
}
</script>
