<template>
  <a
    :class="classes"
    :href="disabled ? null : href"
    v-bind="$attrs"
    @click="handleClick"
  >
    <i v-if="icon" :class="icon"></i>
    <span v-if="$slots.default" class="el-link--inner">
      <slot></slot>
    </span>
  </a>
</template>

<script>
export default {
  name: 'ElLink',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    underline: {
      type: Boolean,
      default: true
    },
    href: String,
    icon: String
  },
  emits: ['click'],
  setup(props, { emit }) {
    const classes = useClasses(props)

    const handleClick = (event) => {
      if (props.disabled) return
      if (props.href) return

      emit('click', event)
    }
    return {
      classes,
      handleClick
    }
  }
}
const useClasses = (props) => {
  return [
    'el-link',
    props.type ? `el-link--${props.type}` : '',
    props.disabled && 'is-disabled',
    props.underline && !props.disabled && 'is-underline'
  ]
}
</script>

<style></style>
