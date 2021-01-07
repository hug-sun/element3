<template>
  <transition name="el-message-fade" @after-leave="handleAfterLeave" appear>
    <div
      v-show="isShow"
      :class="[
        'el-message',
        isShowType ? `el-message--${type}` : '',
        showClose ? 'is-closable' : '',
        center ? 'is-center' : '',
        customClass
      ]"
      :style="[positionStyle]"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
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
  </transition>
</template>

<script>
import { getCurrentInstance, computed, ref } from 'vue'
export default {
  props: {
    message: {
      type: [String, Object]
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
    offset: Number
  },
  emits: ['close'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()

    const isShow = ref(true)
    // @public
    const offsetVal = ref(props.offset)

    const isShowType = computed(() => props.type && !props.iconClass)
    const positionStyle = computed(() => ({
      top: `${offsetVal.value}px`
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
      clearTimeout(timer)
      emit('close', instance)
      isShow.value = false
    }

    function handleAfterLeave() {
      instance.vnode.el.parentElement?.removeChild(instance.vnode.el)
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
      isShow,
      isShowType,
      positionStyle,
      offsetVal,
      handleClose,
      handleAfterLeave,
      handleMouseenter,
      handleMouseleave
    }
  }
}
</script>

<style></style>
