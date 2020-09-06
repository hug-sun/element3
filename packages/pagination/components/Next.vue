<template>
  <button type="button" class="btn-next" :disabled="isDisabled" @click="next">
    <span v-if="nextText">
      {{ nextText }}
    </span>
    <i v-else class="el-icon el-icon-arrow-right"></i>
  </button>
</template>

<script>
import { toRefs, computed } from 'vue'

export default {
  name: 'Next',

  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pageCount: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    nextText: {
      type: String,
      default: ''
    },
    next: Function
  },

  setup(props) {
    const isDisabled = computed(
      () =>
        props.disabled ||
        props.currentPage === props.pageCount ||
        props.pageCount === 0
    )

    return {
      ...toRefs(props),
      isDisabled
    }
  }
}
</script>
