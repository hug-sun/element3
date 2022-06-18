<script setup lang="ts">

import { withDefaults } from 'vue'
interface DividerType {
  direction?:'horizontal'|'vertical'
  contentPosition?:'left'|'center'|'right'
  dividerStyle?:'dotted'|'dashed'|'double'|'solid'
  dark?:boolean
  color?:string
}

withDefaults(defineProps<DividerType>(),{
  direction:'horizontal',
  contentPosition:'center',
  dividerStyle:'solid',
  dark:false,
  color:''
})

</script>

<template>
  <div v-bind="$attrs" :class="['el-divider', `el-divider--${direction}`, `is-${dividerStyle}`]" :style="{color}">
    <div
      v-if="$slots.default && direction !== 'vertical'"
      :class="['el-divider__text', `is-${contentPosition}`, dark?'is-dark':'']"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../theme/src/divider.scss'
</style>
