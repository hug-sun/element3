<template>
  <!-- img -->
  <span class="el-avatar" :style="{ height: size + 'px', width: size + 'px' }" :class="classes" v-if="!icon">
    <img :src="src" :srcset="srcset" :alt="alt" :style="{ objectFit: fit }"/>
    <!-- text -->
    <span v-if="$slots.default && !src && !srcset">
      <slot></slot>
    </span>
  </span>
  <!-- icon text -->
  <span class="el-avatar" :style="{ height: size + 'px', width: size + 'px' }" :class="classes" v-else-if="typeof icon === 'string'">
    <!-- icon + string -->
    <!-- 此处应该是 <el-icon />，用 slot 暂时代替 -->
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </span>
  <!-- 此处是传入的 icon component -->
  <span class="el-avatar" :style="{ height: size + 'px', width: size + 'px' }" :class="classes" v-else>
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
import { Component, withDefaults, computed } from 'vue';
// import { ElIcon } from '../icon/index';

type AvatarSize = 'large' | 'medium' | 'small'
type AvatarFitType = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
type AvatarShapeType = 'circle' | 'square'

interface AvatarProps {
    icon: string | Component,
    size: number | AvatarSize,
    shape: AvatarShapeType,
    src: string,
    srcset: string,
    alt: string,
    fit: AvatarFitType,
    error?: (e: Event) => void,
}
// const defaultImg = 

const props = withDefaults(defineProps<AvatarProps>(),{
  size: 'medium',
  shape: 'circle',
  src: 'data:image/png;base64,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',
  fit: 'contain',
  alt: "",
})

const useClasses = function(props: AvatarProps){
  const shape = props.shape
  const size = props.size
  return computed(() => {
    return [
      shape ? `el-avatar--${shape}` : '',
      size
        ? typeof size === 'string' 
          ? `el-avatar--${size}` 
          : ''
        : `el-avatar--medium`
    ]
  })
}

const classes = useClasses(props)

</script>

<style lang="scss">
@import '../../theme/src/avatar.scss'
</style>