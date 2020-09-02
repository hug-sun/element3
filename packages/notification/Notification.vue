<template>
  <transition name="el-notification-fade" appear>
    <div
      :class="['el-notification', customClass, horizontalClass]"
      v-show="visible"
      :style="positionStyle"
      @mouseenter="clearTimer()"
      @mouseleave="startTimer()"
      @click="click"
      role="alert"
    >
      <i
        class="el-notification__icon"
        :class="[typeClass, iconClass]"
        v-if="type || iconClass"
      >
      </i>
      <div
        class="el-notification__group"
        :class="{ 'is-with-icon': typeClass || iconClass }"
      >
        <h2 class="el-notification__title" v-text="title"></h2>
        <div class="el-notification__content" v-show="message">
          <slot>
            <p v-if="!dangerouslyUseHTMLString">{{ message }}</p>
            <p v-else v-html="message"></p>
          </slot>
        </div>
        <div
          class="el-notification__closeBtn el-icon-close"
          v-if="showClose"
          @click.stop="close"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed, ref } from 'vue'

const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
}

export default {
  name: 'ElNotification',
  props: {
    customClass: { type: String, default: '' },
    dangerouslyUseHTMLString: { type: Boolean, default: false },
    duration: { type: Number, default: 4500 },
    iconClass: { type: String, default: '' },
    id: { type: String, default: '' },
    verticalOffset: { type: Number, default: 0 },
    message: { type: String, default: '' },
    position: {
      type: String,
      default: 'top-right'
    },
    onClose: null,
    onClick: null,
    showClose: { type: Boolean, default: true },
    title: { type: String, default: '' },
    type: { type: String, default: '' }
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false
        this.$el.addEventListener('transitionend', this.destroyElement)
      }
    }
  },
  setup(props) {
    const typeClass = computed(() => {
      return props.type && typeMap[props.type]
        ? `el-icon-${typeMap[props.type]}`
        : ''
    })

    const horizontalClass = computed(() => {
      return props.position.indexOf('right') > -1 ? 'right' : 'left'
    })

    const verticalProperty = computed(() => {
      return props.position.startsWith('top') ? 'top' : 'bottom'
    })

    const positionStyle = computed(() => {
      return {
        [verticalProperty.value]: `${props.verticalOffset}px`
        // zIndex,
      }
    })
    const visible = ref(true)
    const closed = ref(false)
    const timer = ref(null)

    return {
      typeClass,
      horizontalClass,
      verticalProperty,
      positionStyle,
      visible,
      closed,
      timer
    }
  },
  methods: {
    destroyElement() {
      this.$el.parentNode.removeChild(this.$el)
    },

    click() {
      if (typeof this.onClick === 'function') {
        this.onClick()
      }
    },

    close() {
      this.closed = true
      if (typeof this.onClose === 'function') {
        this.onClose()
      }
    },

    clearTimer() {
      clearTimeout(this.timer)
    },

    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close()
          }
        }, this.duration)
      }
    },
    keydown(e) {
      if (e.keyCode === 46 || e.keyCode === 8) {
        this.clearTimer() // detele 取消倒计时
      } else if (e.keyCode === 27) {
        // esc关闭消息
        if (!this.closed) {
          this.close()
        }
      } else {
        this.startTimer() // 恢复倒计时
      }
    }
  },
  mounted() {
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        if (!this.closed) {
          this.close()
        }
      }, this.duration)
    }
    this.visible = true
    document.addEventListener('keydown', this.keydown)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown)
  }
}
</script>
