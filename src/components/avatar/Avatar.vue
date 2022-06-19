<script lang="ts">
import { defineComponent } from 'vue'
import { computed, ref, watch, withDefaults } from 'vue'
import type { Component } from 'vue'
import { ElIcon } from '../icon/index'
export default defineComponent({
  name: 'ElAvatar',
})
</script>

<script setup lang="ts">
type AvatarSize = 'large' | 'medium' | 'small'
type AvatarFitType = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
type AvatarShapeType = 'circle' | 'square'

interface AvatarProps {
  icon?: string | Component
  size?: number | AvatarSize
  shape?: AvatarShapeType
  src?: string
  srcset?: string
  alt?: string
  fit?: AvatarFitType
}

interface AvatarEmits {
  error: (e: Event) => Event
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'medium',
  shape: 'circle',
  fit: 'contain',
})
const emit = defineEmits(['error'])

const useClasses = function (props: AvatarProps) {
  const shape = props.shape
  const size = props.size
  const icon = props.icon
  return computed(() => {
    return [
      shape ? `el-avatar--${shape}` : '',
      size
        ? typeof size === 'string'
          ? `el-avatar--${size}`
          : ''
        : 'el-avatar--medium',
      icon ? 'el-avatar--icon' : '',
    ]
  })
}
const useAvatarStyle = function (props: AvatarProps) {
  const size = props.size
  return computed(() => {
    return Number.isNaN(Number(size)) ? '' : { height: `${size}px`, width: `${size}px` }
  })
}
const useFitStyle = function (props: AvatarProps) {
  const fit = props.fit
  return computed(() => {
    return { objectFit: fit }
  })
}

const classes = useClasses(props)
const avatarStyle = useAvatarStyle(props)
const fitStyle = useFitStyle(props)

const errorFlag = ref(false)
watch(() => props.src, () => (errorFlag.value = false))

const errorHandler = (e: Event) => {
  errorFlag.value = true
  emit('error', e)
}
</script>

<template>
  <span v-if="!icon" class="el-avatar" :style="avatarStyle" :class="classes">
    <img
      v-if="(src || srcset) && !errorFlag"
      :src="src"
      :srcset="srcset"
      :alt="alt"
      :style="{ objectFit: fit }"
      @error="errorHandler($event)"
    />
    <slot v-else />
  </span>
  <span v-else-if="typeof icon === 'string'" class="el-avatar" :style="avatarStyle" :class="classes">
    <el-icon :name="icon" />
  </span>
  <span v-else class="el-avatar" :style="avatarStyle" :class="classes">
    <slot />
  </span>
</template>

<style lang="scss">
@import '../../theme/src/avatar.scss';
</style>
