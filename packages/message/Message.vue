<template>
  <transition name="el-message-fade" @after-leave="handleAfterLeave" appear>
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
import { computed, reactive, watch, onMounted, onUnmounted, toRefs } from 'vue'

const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
}

export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    message: {
      type: [String, Object],
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
    },
    onClose: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const state = reactive({
      visible: true,
      closed: false,
      timer: null
    })

    const typeClass = computed(() => {
      return props.type && !props.iconClass
        ? `el-message__icon el-icon-${typeMap[props.type]}`
        : ''
    })

    const positionStyle = computed(() => ({ top: `${props.verticalOffset}px` }))

    const close = () => {
      state.closed = true
      if (typeof props.onClose === 'function') {
        props.onClose(this)
      }
    }

    const clearTimer = () => {
      clearTimeout(state.timer)
    }

    const startTimer = () => {
      if (props.duration > 0) {
        state.timer = setTimeout(() => {
          if (!state.closed) {
            close()
          }
        }, props.duration)
      }
    }

    const keydown = (e) => {
      if (e.keyCode === 27) {
        // esc关闭消息
        if (!state.closed) {
          props.onClose(this)
        }
      }
    }

    const handleAfterLeave = (currentElement) => {
      if (currentElement && currentElement.parentNode) {
        currentElement.parentNode.removeChild(currentElement)
      }
    }

    watch(
      () => state.closed,
      (newVal) => {
        if (newVal) {
          state.visible = false
        }
      }
    )

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
      close,
      clearTimer,
      startTimer,
      handleAfterLeave,
      ...toRefs(state)
    }
  }
}
</script>
