<template>
  <span v-if="!icon" class="el-avatar" :style="avatarStyle" :class="classes">
    <img
      v-if="(src || srcset) && !errorFlag" 
      @error="errorHandler($event)" 
      :src="src"
      :srcset="srcset"
      :alt="alt"
      :style="{ objectFit: fit }"
    />
    <slot v-else></slot>
  </span>
  <span v-else-if="typeof icon === 'string'" class="el-avatar" :style="avatarStyle" :class="classes">
    <el-icon :name="icon" />
  </span>
  <span  v-else class="el-avatar" :style="avatarStyle" :class="classes">
    <slot></slot>
  </span>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ElAvatar'
})
</script>
<script setup lang="ts">
import { Component, withDefaults, computed, ref, watch } from 'vue';
import { ElIcon } from '../icon/index';

type AvatarSize = 'large' | 'medium' | 'small'
type AvatarFitType = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
type AvatarShapeType = 'circle' | 'square'

interface AvatarProps {
  icon: string | Component,
  size?: number | AvatarSize,
  shape?: AvatarShapeType,
  src?: string,
  srcset?: string,
  alt?: string,
  fit?: AvatarFitType,
}

interface AvatarEmits {
  error: (e: Event) => Event;
}

const emit = defineEmits([ 'error' ])
const props = withDefaults(defineProps<AvatarProps>(),{
  size: 'medium',
  shape: 'circle',
  fit: 'contain',
})

const useClasses = function(props: AvatarProps){
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
        : `el-avatar--medium`,
      icon ? `el-avatar--icon` : ''
    ]
  })
}
const useAvatarStyle = function (props: AvatarProps) {
  const size = props.size
  return computed(() => {
    return Number.isNaN(Number(size)) ? '' : { height: size + 'px', width: size + 'px' }
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

<style lang="scss">
@import '../../theme/src/avatar.scss';

[class^=el-icon-], [class*=" el-icon-"] {
  --color: inherit;
  height: 1em;
  width: 1em;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  fill: currentColor;
  color: var(--color);
  font-size: inherit;
}
</style>