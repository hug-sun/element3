<template>
  <div
    :style="positionStyle"
    :class="[
      'el-message',
      isShowType ? `el-message--${type}` : '',
      showClose ? 'is-closable' : '',
      center ? 'is-center' : '',
      customClass
    ]"
  >
    <i v-if="iconClass" :class="iconClass"></i>
    <i v-else :class="['el-message__icon', `el-icon-${type}`]"></i>
    <slot>
      <p
        class="el-message__content"
        v-if="dangerouslyUseHTMLString"
        v-html="message"
      ></p>
      <p class="el-message__content" v-else>
        {{ message }}
      </p>
    </slot>
    <i
      v-if="showClose"
      class="el-message__closeBtn el-icon-close"
      @click="handleClose"
    ></i>
  </div>
</template>
<script>
import { getCurrentInstance, computed, ref } from 'vue'
export default {
  props: {
    message: {
      type: [String, Object]
    },
    visiable: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      defalut: 'info',
      validator(val) {
        return ['success', 'warning', 'info', 'error'].includes(val)
      }
    },
    iconClass: String,
    showClose: Boolean,
    duration: Number,
    center: Boolean,
    customClass: String,
    dangerouslyUseHTMLString: Boolean,
    offset: Number,
    onCloseHook: Function
  },
  emits: ['close'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()

    // @public
    const offsetTop = ref(props.offset)

    const isShowType = computed(() => props.type && !props.iconClass)
    const positionStyle = computed(() => ({
      top: `${offsetTop.value}px`
    }))

    let timer
    function delayClose() {
      if (props.duration > 0) {
        timer = setTimeout(() => {
          _close()
        }, props.duration)
      }
    }

    function _close() {
      emit('close', instance)
      props.onCloseHook(instance)
      clearTimeout(timer)
    }

    function handleAfterLeave(el) {
      el.parentNode?.removeChild(el)
    }

    function handleClose() {
      _close()
    }

    function handleMouseenter() {
      clearTimeout(timer)
    }

    function handleMouseleave() {
      delayClose()
    }

    // @public
    function close() {
      _close()
    }

    delayClose()
    return {
      close,
      isShowType,
      positionStyle,
      offsetTop,
      handleClose,
      handleAfterLeave,
      handleMouseenter,
      handleMouseleave
    }
  }
}
</script>
