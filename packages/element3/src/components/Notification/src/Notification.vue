<template>
  <transition
    name="el-notification-fade"
    @after-leave="handleAfterLeave"
    appear
  >
    <div
      :class="['el-notification', customClass, horizontalClass]"
      v-show="visible"
      :style="positionStyle"
      @click="handleClick"
      @keydown="handleKeydown"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
      role="alert"
    >
      <i
        class="el-notification__icon"
        :class="typeClass || iconClass"
        v-if="type || iconClass"
      ></i>
      <div class="el-notification__group">
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
          @click="handleClose"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed, getCurrentInstance, ref, defineComponent } from 'vue'
import { notificationProps } from './props.js'
export default defineComponent({
  name: 'ElNotification',
  props: notificationProps,
  emits: ['close'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const visible = ref(true)
    const verticalOffsetVal = ref(props.verticalOffset)

    const typeClass = computed(() => {
      return props.type ? `el-icon-${props.type}` : ''
    })

    const horizontalClass = computed(() => {
      return props.position.endsWith('right') ? 'right' : 'left'
    })

    const verticalProperty = computed(() => {
      return props.position.startsWith('top') ? 'top' : 'bottom'
    })

    const positionStyle = computed(() => {
      return {
        [verticalProperty.value]: `${verticalOffsetVal.value}px`
      }
    })

    function _click() {
      emit('click', instance)
    }
    function handleClick() {
      _click()
    }

    function click() {
      _click()
    }

    function _close() {
      clearTimeout(timer)
      emit('close', instance)
      visible.value = false
    }
    function handleClose() {
      _close()
    }

    function close() {
      _close()
    }

    let timer
    function delayClose() {
      if (props.duration > 0) {
        timer = setTimeout(() => {
          _close()
        }, props.duration)
      }
    }

    const handleKeydown = (e) => {
      if (e.keyCode === 46 || e.keyCode === 8) {
        clearTimeout(timer)
      } else if (e.keyCode === 27) {
        _close()
      } else {
        delayClose()
      }
    }

    function handleMouseenter() {
      clearTimeout(timer)
    }
    function handleMouseleave() {
      delayClose()
    }

    function handleAfterLeave() {
      instance.vnode.el.parentElement?.removeChild(instance.vnode.el)
    }

    delayClose()

    return {
      close,
      click,
      visible,
      typeClass,
      positionStyle,
      horizontalClass,
      verticalProperty,
      verticalOffsetVal,
      handleClose,
      handleClick,
      handleKeydown,
      handleMouseenter,
      handleMouseleave,
      handleAfterLeave
    }
  }
})
</script>
