<script setup lang="ts">
import { provide } from 'vue'
interface FormProps {
  size?: string
  model?: Object
}
const props = defineProps<FormProps>()

provide('elForm', {
  size: props.size,
})
</script>

<template>
  <form
    class="el-form"
    :class="[]"
  >
    <slot />
  </form>
</template>
