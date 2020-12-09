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
import { defineComponent, computed, toRefs, ref } from 'vue'
import { props } from './props'
export default defineComponent({
  name: 'ElAvatar',

  props: props,

  setup(props) {
    const { size, shape, icon } = toRefs(props)

    const error = ref(false)

    const style = useStyle(size)

    const classes = useClass(size, shape, icon)

    const handleError = () => {
      error.value = true
    }

    return {
      ...toRefs(props),
      style,
      classes,
      error,
      handleError
    }
  }
})

const useStyle = (size) => {
  if (!isNumber(size.value)) {
    return {}
  }

  return computed(() => {
    return {
      lineHeight: `${size.value}px`,
      height: `${size.value}px`,
      width: `${size.value}px`
    }
  })
}

const useClass = (size, shape, icon) => {
  const classList = ['el-avatar']

  if (isString(size.value)) {
    classList.push(`el-avatar--${size.value}`)
  }

  if (shape.value) {
    classList.push(`el-avatar--${shape.value}`)
  }

  if (icon) {
    classList.push('el-avatar--icon')
  }

  return classList
}
</script>
