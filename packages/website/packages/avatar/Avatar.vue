<template>
  <span :class="avatarClass" :style="sizeStyle">
    <img
      v-if="isImageExist && src"
      :src="src"
      @error="handleError"
      :alt="alt"
      :srcSet="srcSet"
      :style="{ 'object-fit': fit }"
    />
    <i v-else-if="icon" :class="icon" />
    <slot v-else></slot>
  </span>
</template>

<script>
import { computed, toRefs, ref } from 'vue'
export default {
  name: 'ElAvatar',

  props: {
    size: {
      type: [Number, String],
      default: 'large',
      validator(val) {
        if (typeof val === 'string') {
          return ['large', 'medium', 'small'].includes(val)
        }
        return typeof val === 'number'
      }
    },
    shape: {
      type: String,
      default: 'circle',
      validator(val) {
        return ['circle', 'square'].includes(val)
      }
    },
    icon: String,
    src: String,
    alt: String,
    srcSet: String,
    error: Function,
    fit: {
      type: String,
      default: 'cover'
    }
  },

  setup(props) {
    const { error, size, icon, shape } = toRefs(props)

    const isImageExist = ref(true)

    const handleError = (e) => {
      const errorFlag = error?.value(e)
      if (!!errorFlag !== false) {
        isImageExist.value = false
      }
    }

    const sizeStyle = useSizeStyle(size)
    const avatarClass = useAvatarClass(size, icon, shape)

    return { isImageExist, handleError, sizeStyle, avatarClass }
  }
}

const useSizeStyle = (size) => {
  return computed(() => {
    return size && typeof size.value === 'number'
      ? {
          height: `${size.value}px`,
          width: `${size.value}px`,
          lineHeight: `${size.value}px`
        }
      : {}
  })
}

const useAvatarClass = (size, icon, shape) => {
  return computed(() => {
    const classList = ['el-avatar']

    if (size && typeof size.value === 'string') {
      classList.push(`el-avatar--${size.value}`)
    }

    if (icon) {
      classList.push('el-avatar--icon')
    }

    if (shape) {
      classList.push(`el-avatar--${shape.value}`)
    }

    return classList.join(' ')
  })
}
</script>
