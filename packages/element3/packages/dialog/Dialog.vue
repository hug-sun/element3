<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-show="visible"
      class="el-dialog__wrapper"
      @click.self="handleWrapperClick"
    >
      <div
        role="dialog"
        :key="key"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="[
          'el-dialog',
          { 'is-fullscreen': fullscreen, 'el-dialog--center': center },
          customClass
        ]"
        ref="dialog"
        :style="style"
      >
        <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body" v-if="rendered">
          <slot></slot>
        </div>
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { popupProps, usePopup } from '../../src/composables/popup'
import { useEmitter } from '../../src/composables/emitter'
import {
  toRefs,
  ref,
  getCurrentInstance,
  computed,
  onMounted,
  onUnmounted,
  watch,
  nextTick
} from 'vue'

export default {
  name: 'ElDialog',
  props: {
    ...popupProps,
    title: {
      type: String,
      default: ''
    },

    modal: {
      type: Boolean,
      default: true
    },

    modalAppendToBody: {
      type: Boolean,
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: false
    },

    lockScroll: {
      type: Boolean,
      default: true
    },

    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    width: String,
    fullscreen: Boolean,
    customClass: {
      type: String,
      default: ''
    },

    top: {
      type: String,
      default: '15vh'
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    },
    destroyOnClose: Boolean
  },
  emits: ['update:visible', 'close', 'opened', 'open', 'closed'],
  setup(props, { emit }) {
    const { visible, rendered, open } = usePopup(props)
    const {
      appendToBody,
      fullscreen,
      top,
      width,
      closeOnClickModal,
      destroyOnClose
    } = toRefs(props)
    const closed = ref(false)
    const key = ref(0)
    const dialog = ref(null)
    const instanc = getCurrentInstance()
    const { broadcast } = useEmitter()
    const style = computed(() => {
      const style = {}
      if (!(fullscreen && fullscreen.value)) {
        style.marginTop = top.value
        if (width && width.value) {
          style.width = width.value
        }
      }
      return style
    })
    const handleWrapperClick = () => {
      if (!closeOnClickModal.value) return
      handleClose()
    }
    const handleClose = () => {
      if (typeof props.beforeClose === 'function') {
        props.beforeClose(hide)
      } else {
        hide()
      }
    }
    const hide = (cancel) => {
      if (cancel !== false) {
        emit('update:visible', false)
        emit('close')
        closed.value = true
      }
    }
    const updatePopper = () => {
      broadcast('updatePopper')
      broadcast('updatePopper')
    }
    const afterEnter = () => {
      emit('opened')
    }
    const afterLeave = () => {
      emit('closed')
    }
    watch(visible, (val) => {
      const el = instanc.proxy.$el
      if (val) {
        closed.value = false
        emit('open')
        el.addEventListener('scroll', updatePopper)
        nextTick(() => {
          dialog.value.scrollTop = 0
        })
        if (appendToBody.value) {
          document.body.appendChild(el)
        }
      } else {
        el.removeEventListener('scroll', updatePopper)
        if (!closed.value) emit('close')
        if (destroyOnClose && destroyOnClose.value) {
          nextTick(() => {
            key.value++
          })
        }
      }
    })
    onMounted(() => {
      if (visible.value) {
        rendered.value = true
        open()
        if (appendToBody.value) {
          document.body.appendChild(instanc.proxy.$el)
        }
      }
    })
    onUnmounted(() => {
      const el = instanc.proxy.$el
      if (appendToBody.value && el && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    })
    return {
      dialog,
      key,
      rendered,
      handleClose,
      style,
      handleWrapperClick,
      afterEnter,
      afterLeave
    }
  }
}
</script>
