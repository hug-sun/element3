<template>
  <transition name="el-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="internalVisible"
      class="el-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]"
    >
      <div class="el-loading-spinner">
        <svg v-if="!spinner" class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none" />
        </svg>
        <i v-else :class="spinner"></i>
        <p v-if="text" class="el-loading-text">{{ internalText }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue'
export default {
  inheritAttrs: false,

  props: {
    text: {
      type: String,
      default: null
    },
    spinner: {
      type: String,
      default: null
    },
    background: {
      type: String,
      default: null
    },
    fullscreen: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const handleAfterLeave = () => {
      // TODO 这里的 emit 修改会造成对 api 的更改
      // eslint-disable-next-line vue/custom-event-name-casing
      emit('afterLeave')
    }
    const internalVisible = ref(props.visible)
    const internalText = ref(props.text)
    const show = () => {
      internalVisible.value = true
    }
    const close = () => {
      internalVisible.value = false
    }
    const setText = (text) => {
      internalText.value = text
    }
    return {
      internalVisible,
      internalText,
      handleAfterLeave,
      show,
      close,
      setText
    }
  }
}
</script>
