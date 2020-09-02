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
      ></i>
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
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  getCurrentInstance
} from 'vue'

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
    let timer = ref(null)

    const close = () => {
      closed.value = true
      if (typeof props.onClose === 'function') {
        props.onClose()
      }
    }
    const clearTimer = () => {
      clearTimeout(timer)
    }
    const keydown = (e) => {
      if (e.keyCode === 46 || e.keyCode === 8) {
        clearTimer() // detele 取消倒计时
      } else if (e.keyCode === 27) {
        // esc关闭消息
        if (!closed.value) {
          close()
        }
      } else {
        startTimer() // 恢复倒计时
      }
    }
    const startTimer = () => {
      if (props.duration > 0) {
        timer = setTimeout(() => {
          if (!closed.value) {
            close()
          }
        }, props.duration)
      }
    }

    onMounted(() => {
      startTimer()
      visible.value = true
      document.addEventListener('keydown', keydown)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', keydown)
    })

    const click = () => {
      if (typeof props.onClick === 'function') {
        props.onClick()
      }
    }

    const _this = getCurrentInstance().ctx
    const destroyElement = () => {
      _this.$el.parentNode.removeChild(_this.$el)
    }
    watch(
      () => closed.value,
      (newVal) => {
        if (newVal) {
          visible.value = false
          _this.$el.addEventListener('transitionend', destroyElement)
        }
      }
    )

    return {
      typeClass,
      horizontalClass,
      verticalProperty,
      positionStyle,
      visible,
      closed,
      timer,
      close,
      clearTimer,
      startTimer,
      click
    }
  },
  methods: {}
}
</script>
