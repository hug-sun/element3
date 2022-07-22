<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalOptions } from '../../hooks/globalConfig'
type TagType = 'success' | 'warning' | 'danger' | 'info'
type TagSize = 'medium' | 'small' | 'mini'
type TagEffect = 'dark' | 'light' | 'plain'

interface TagProps {
  type?: TagType
  closable?: boolean
  disableTransitions?: boolean
  hit?: boolean
  color?: string
  size?: TagSize
  effect?: TagEffect
}

const props = withDefaults(defineProps<TagProps>(), {
  closable: false,
  disableTransitions: false,
  effect: 'light',
})
const emit = defineEmits(['close', 'click'])

const globalSize = useGlobalOptions().size
function useClasses(props: TagProps) {
  return computed(() => {
    return [
      'el-tag',
      props.type ? `el-tag--${props.type}` : '',
      props.hit ? 'is-hit' : '',
      globalSize
        ? `el-tag--${globalSize}`
        : props.size
          ? `el-tag--${props.size}`
          : '',
      props.effect ? `el-tag--${props.effect}` : '',
    ]
  })
}
const classes = useClasses(props)

function useStyle(props: TagProps) {
  return computed(() => {
    return { color: props.color }
  })
}
const styles = useStyle(props)
</script>

<template>
  <Transition appear :name="disableTransitions ? '' : 'el-zoom-in-center'">
    <span :class="classes" :style="styles" @click="emit('click')">
      <slot />
      <i
        v-if="closable"
        class="el-tag__close el-icon-close"
        @click.stop="emit('close')"
      />
    </span>
  </Transition>
</template>

<style lang="scss">
@import '../../theme/src/tag.scss';
@import '../../theme/src/common/transition.scss';
</style>
