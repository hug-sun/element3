<template>
  <span :style="style" :class="classes">
    <img
      v-if="!error && src"
      :src="src"
      :alt="alt"
      :srcSet="srcSet"
      @error="handleError"
      :style="{ 'object-fit': fit }"
    />
    <i v-else-if="icon" :class="icon" />
    <slot v-else></slot>
  </span>
</template>

<script>
import { isString, isNumber } from '../../src/utils/types'
import { defineComponent, computed, toRefs, ref, unref } from 'vue'
import { props } from './props'
export default defineComponent({
  name: 'ElAvatar',

  props: props,

  setup(props) {
    const { size, shape, src, alt, srcSet, fit, icon } = toRefs(props)

    const error = ref(false)

    const style = useStyle(size)

    const classes = useClass(size, shape, icon)

    const handleError = () => {
      error.value = true
    }

    return {
      style,
      classes,
      src,
      alt,
      srcSet,
      fit,
      error,
      icon,
      handleError
    }
  }
})

const useStyle = (size) => {
  const value = unref(size)

  if (!isNumber(value)) {
    return {}
  }

  return computed(() => {
    return {
      lineHeight: `${value}px`,
      height: `${value}px`,
      width: `${value}px`
    }
  })
}

const useClass = (size, shape, icon) => {
  const classList = ['el-avatar']

  size = unref(size)

  shape = unref(shape)

  icon = unref(icon)

  if (size && isString(size)) {
    classList.push(`el-avatar--${size}`)
  }

  if (shape) {
    classList.push(`el-avatar--${shape}`)
  }

  if (icon) {
    classList.push('el-avatar--icon')
  }

  return classList
}
</script>
