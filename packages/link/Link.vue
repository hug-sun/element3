<template>
  <a
    :class="[
      'el-link',
      type ? `el-link--${type}` : '',
      disabled && 'is-disabled',
      underline && !disabled && 'is-underline'
    ]"
    :href="disabled ? null : href"
    v-bind="$attrs"
    @click="handleClick"
  >
    <i :class="icon" v-if="icon"></i>

    <span v-if="$slots.default" class="el-link--inner">
      <slot></slot>
    </span>

    <slot v-if="$slots.icon" name="icon"></slot>
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
    underline: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    href: String,
    icon: String
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (evt) => {
      if (props.disabled) return
      if (props.href) return

      emit('click', evt)
    }

    return {
      handleClick
    }
  }
}
</script>
