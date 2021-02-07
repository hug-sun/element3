<template>
  <transition
    name="el-drawer-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div class="el-drawer__wrapper" tabindex="-1" v-show="visible">
      <div
        class="el-drawer__container"
        :class="visible && 'el-drawer__open'"
        @click.self="handleWrapperClick"
        role="document"
        tabindex="-1"
      >
        <div
          aria-modal="true"
          aria-labelledby="el-drawer__title"
          :aria-label="title"
          class="el-drawer"
          :class="[direction, customClass]"
          :style="isHorizontal ? `width: ${size}` : `height: ${size}`"
          ref="drawer"
          role="dialog"
          tabindex="-1"
        >
          <header
            class="el-drawer__header"
            id="el-drawer__title"
            v-if="withHeader"
          >
            <slot name="title">
              <span role="heading" tabindex="0" :title="title">
                {{ title }}
              </span>
            </slot>
            <button
              :aria-label="`close ${title || 'drawer'}`"
              class="el-drawer__close-btn"
              type="button"
              v-if="showClose"
              @click="closeDrawer"
            >
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
          </header>
          <section class="el-drawer__body" v-if="rendered">
            <slot></slot>
          </section>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  toRefs,
  computed,
  ref,
  watch,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted
} from 'vue'
import { popupProps, usePopup } from '../../src/composables/popup'
import Utils from '../../src/utils/aria-utils'

export default {
  name: 'ElDrawer',
  props: {
    ...popupProps,
    appendToBody: {
      type: Boolean,
      default: false
    },
    beforeClose: {
      type: Function
    },
    customClass: {
      type: String,
      default: ''
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: 'rtl',
      validator(val) {
        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(val) !== -1
      }
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: '30%'
    },
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean
    },
    wrapperClosable: {
      type: Boolean,
      default: true
    },
    withHeader: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:visible', 'close', 'opened', 'open', 'closed'],
  setup(props, { emit }) {
    const { rendered, open } = usePopup(props)
    const {
      appendToBody,
      beforeClose,
      destroyOnClose,
      direction,
      visible,
      wrapperClosable
    } = toRefs(props)

    const closed = ref(false)
    const prevActiveElement = ref(null)
    const drawer = ref(null)
    const self = getCurrentInstance().proxy

    const isHorizontal = computed(() => {
      return direction.value === 'rtl' || direction.value === 'ltr'
    })

    watch(visible, (val) => {
      const el = self.$el
      if (val) {
        closed.value = false
        emit('open')
        if (appendToBody.value) {
          document.body.appendChild(el)
        }
        prevActiveElement.value = document.activeElement
        nextTick(() => {
          Utils.focusFirstDescendant(drawer.value)
        })
      } else {
        if (!closed.value) emit('close')
        nextTick(() => {
          if (prevActiveElement.value) {
            prevActiveElement.value.focus()
          }
        })
      }
    })

    const afterEnter = () => {
      emit('opened')
    }

    const afterLeave = () => {
      emit('closed')
    }

    const handleWrapperClick = () => {
      if (wrapperClosable.value) {
        closeDrawer()
      }
    }

    const closeDrawer = () => {
      if (beforeClose && typeof beforeClose.value === 'function') {
        beforeClose.value(hide)
      } else {
        hide()
      }
    }

    const hide = (cancel) => {
      if (cancel !== false) {
        emit('update:visible', false)
        emit('close')
        if (destroyOnClose.value === true) {
          rendered.value = false
        }
        closed.value = true
      }
    }

    // todo: ESC 退出模态框,暂时无调用，lint过不去先在return调用
    const handleClose = () => {
      // This method here will be called by PopupManger, when the `closeOnPressEscape` was set to true
      // pressing `ESC` will call this method, and also close the drawer.
      // This method also calls `beforeClose` if there was one.
      closeDrawer()
    }

    onMounted(() => {
      if (visible.value) {
        rendered.value = true
        open()
      }
    })

    onUnmounted(() => {
      // if appendToBody is true, remove DOM node after destroy
      if (appendToBody.value && self.$el && self.$el.parentNode) {
        self.$el.parentNode.removeChild(self.$el)
      }
    })

    return {
      isHorizontal,
      drawer,
      rendered,
      afterEnter,
      afterLeave,
      handleWrapperClick,
      closeDrawer,
      handleClose
    }
  }
}
</script>
