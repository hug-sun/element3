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
import { isString, isNumber } from '../../src/utils/types'
import { defineComponent, computed, toRefs, ref } from 'vue'
import { props } from './props'
export default defineComponent({
  name: 'ElAvatar',

  props: props,

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
      ...toRefs(props),
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
