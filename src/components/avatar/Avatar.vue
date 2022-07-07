<script setup lang="ts">
import { computed, ref, withDefaults } from 'vue'

type AvatarSize = 'large' | 'medium' | 'small'
type AvatarFitType = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
type AvatarShapeType = 'circle' | 'square'

interface AvatarProps {
  icon?: string
  size?: Number | AvatarSize
  shape?: AvatarShapeType
  src?: string
  srcset?: string
  alt?: string
  fit?: AvatarFitType
}

const props = withDefaults(defineProps<AvatarProps>(), {
  icon: 'el-icon-user',
  size: 'medium',
  shape: 'circle',
  fit: 'contain',
})

function useAvatarSize(props: AvatarProps) {
  return computed(() => {
    const size = Number(props.size)
    if (Number.isNaN(size))
      return
    return `
            height: ${size}px;
            width: ${size}px;
            font-size: ${size / 2.6}px;
            line-height: ${size}px;
           `
  })
}

function useClasses(props: AvatarProps) {
  return computed(() => {
    let avatarSize = ''
    if (typeof props.size === 'string')
      avatarSize = `el-avatar--${props.size}`

    return [
      'el-avatar',
      `el-avatar--${props.shape}`,
      avatarSize,
    ]
  })
}

function useFitStyle(props: AvatarProps) {
  return computed(() => {
    return `object-fit: ${props.fit}`
  })
}

const toggle = ref(true)

const avatarSize = useAvatarSize(props)
const classes = useClasses(props)
const fitStyle = useFitStyle(props)

function imgLoaded() { toggle.value = false }
</script>

<template>
  <div :class="classes" :style="avatarSize">
    <span v-if="(src || srcset)">
      <img v-show="!toggle" :src="src" :srcset="srcset" :alt="alt" :style="fitStyle" @load="imgLoaded">
    </span>
    <span v-else-if="$slots.default">
      <slot />
    </span>
    <i v-show="toggle" :class="icon" />
  </div>
</template>

<style lang="scss">
@import '../../theme/src/avatar.scss';
</style>
