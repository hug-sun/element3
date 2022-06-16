<template>
  <div v-bind="$attrs" :class="['el-divider', `el-divider--${direction}`]">
    <div
      v-if="$slots.default && direction !== 'vertical'"
      :class="['el-divider__text', `is-${contentPosition}`]"
    >
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import {withDefaults} from 'vue'
interface DividerTyoe {
  direction?:'horizontal'|'vertical',
  contentPosition?:'left'|'center'|'right'
}

withDefaults(defineProps<DividerTyoe>(),{
  direction:'horizontal',
  contentPosition:'center'
})

</script>
<style lang="scss">
@import '../../theme/src/divider.scss'

</style>
