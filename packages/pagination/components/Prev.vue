<template>
  <button type="button" class="btn-prev" :disabled="isDisabled" @click="prev">
    <span v-if="prevText">
      {{ prevText }}
    </span>
    <i v-else class="el-icon el-icon-arrow-left"></i>
  </button>
</template>

<script>
import { computed, toRefs } from 'vue'

export default {
  name: 'Prev',

  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    prevText: {
      type: String,
      default: ''
    },
    prev: Function
  },

  setup(props) {
    const isDisabled = computed(() => props.disabled || props.currentPage <= 1)
    return {
      ...toRefs(props),
      isDisabled
    }
  }
}
</script>
