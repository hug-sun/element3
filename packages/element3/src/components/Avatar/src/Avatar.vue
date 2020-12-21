<template>
  <span :style="style" :class="classes">
    <img
      v-if="isShow && src"
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
import { isString, isNumber } from '../../../utils/types'
import { defineComponent, computed, toRefs, ref } from 'vue'
import { props } from './props'
export default defineComponent({
  name: 'ElAvatar',

  props,

  setup(props) {
    const { size, shape, icon, error } = toRefs(props)

    const style = useStyle(size)

    const isShow = ref(true)

    const classes = useClass(size, shape, icon)

    const handleError = (e) => {
      const ret = error?.value(e)

      if (ret !== false) {
        isShow.value = false
      }
    }

    return {
      style,
      isShow,
      classes,
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
  return computed(() => {
    const classList = ['el-avatar']

    if (isString(size.value)) {
      classList.push(`el-avatar--${size.value}`)
    }

    if (shape) {
      classList.push(`el-avatar--${shape.value}`)
    }

    if (icon) {
      classList.push('el-avatar--icon')
    }

    return classList
  })
}
</script>
