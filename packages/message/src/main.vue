<template>
  <transition name="el-message-fade">
    <div
      :class="[
        'el-message',
        type && !iconClass ? `el-message--${type}` : '',
        center ? 'is-center' : '',
        showClose ? 'is-closable' : '',
        customClass
      ]"
      :style="positionStyle"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      role="alert"
    >
      <i :class="iconClass" v-if="iconClass"></i>
      <i :class="typeClass" v-else></i>
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="el-message__content">
          {{ message }}
        </p>
        <p v-else v-html="message" class="el-message__content"></p>
      </slot>
      <i
        v-if="showClose"
        class="el-message__closeBtn el-icon-close"
        @click="close"
      ></i>
    </div>
  </transition>
</template>

<script type="text/babel">
import { computed, reactive, watch, onMounted, onUnmounted } from 'vue'

const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
}

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 3000
    },
    type: {
      type: String,
      default: 'info',
      validator(val) {
        return ['success', 'warning', 'info', 'error'].indexOf(val) > -1
      }
    },
    iconClass: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: ''
    },
    showClose: {
      type: Boolean,
      default: false
    },
    closed: {
      type: Boolean,
      default: false
    },
    verticalOffset: {
      type: Number,
      default: 20
    },
    dangerouslyUseHTMLString: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const state = reactive({
      visible: true,
      message: '',
      duration: 3000,
      type: 'info',
      iconClass: '',
      customClass: '',
      onClose: null,
      showClose: false,
      closed: false,
      verticalOffset: 20,
      timer: null,
      dangerouslyUseHTMLString: false,
      center: false
    })

    const typeClass = computed(() => {
      return state.type && !state.iconClass
        ? `el-message__icon el-icon-${typeMap[state.type]}`
        : ''
    })
    const positionStyle = computed(() => {
      return {
        top: `${state.verticalOffset}px`
      }
    })

    // eslint-disable-next-line no-unused-vars
    const close = () => {
      state.closed = true
      if (typeof state.onClose === 'function') {
        state.onClose(this)
      }
    }

    // eslint-disable-next-line no-unused-vars
    const clearTimer = () => {
      clearTimeout(state.timer)
    }

    const startTimer = () => {
      if (state.duration > 0) {
        state.timer = setTimeout(() => {
          if (!state.closed) {
            state.close()
          }
        }, state.duration)
      }
    }

    const keydown = (e) => {
      if (e.keyCode === 27) {
        // esc关闭消息
        if (!state.closed) {
          state.close()
        }
      }
    }

    watch(state.closed, (newVal) => {
      if (newVal) {
        state.visible = false
      }
    })

    onMounted(() => {
      startTimer()
      document.addEventListener('keydown', keydown)
    })
    onUnmounted(() => {
      document.removeEventListener('keydown', keydown)
    })

    return {
      typeClass,
      positionStyle,
      keydown
    }
  }
}
</script>
