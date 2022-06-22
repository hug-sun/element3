<script lang='ts' setup>
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import ImgEmpty from './img-empty.vue'

const props = defineProps({
  image: {
    type: String,
    default: '',
  },
  imageSize: Number,
  description: {
    type: String,
    default: '',
  },
})

const imageStyle = computed<CSSProperties>(() => ({
  width: props.imageSize ? `${props.imageSize}px` : '',
}))

const emptyText = 'No Data'
const emptyDescription = computed(
  () => props.description || emptyText,
)
</script>

<template>
  <div class="el-empty">
    <div class="el-empty__image" :style="imageStyle">
      <img v-if="image" :src="image">
      <slot v-else name="image">
        <img-empty />
      </slot>
    </div>
    <div class="el-empty__description">
      <slot v-if="$slots.description" name="description" />
      <p v-else>
        {{ emptyDescription }}
      </p>
    </div>
    <div v-if="$slots.default" class="el-empty__bottom">
      <slot />
    </div>
  </div>
</template>

<style lang='scss'>
@import '../../theme/src/empty.scss'
</style>
