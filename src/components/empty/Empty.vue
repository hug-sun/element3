<script lang='ts' setup>
import { computed, withDefaults } from 'vue'
import type { CSSProperties } from 'vue'
import ImgEmpty from './img-empty.vue'

interface EmptyType {
  image?: string
  imageSize?: Number
  description?: string
}

const props = withDefaults(defineProps<EmptyType>(), {
  description: 'No Data',
})

const imageStyle = computed<CSSProperties>(() => ({
  width: props.imageSize ? `${props.imageSize}px` : '',
}))
</script>

<template>
  <div class="el-empty">
    <div class="el-empty__image" :style="imageStyle">
      <img v-if="image" :src="image">
      <img-empty v-else />
    </div>
    <div class="el-empty__description">
      <p>{{ description }}</p>
    </div>
    <div v-if="$slots.default" class="el-empty__bottom">
      <slot />
    </div>
  </div>
</template>

<style lang='scss'>
@import '../../theme/src/empty.scss'
</style>
