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
              <span role="heading" tabindex="0" :title="title">{{
                title
              }}</span>
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
  reactive,
  toRefs,
  computed,
  watch,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  nextTick,
  ref
} from 'vue'
import { popupProps, usePopup } from 'element-ui/src/use/popup'
import Utils from 'element-ui/src/utils/aria-utils'

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
    const drawer = ref(null)
    const instance = getCurrentInstance()
    const { visible, rendered, open } = usePopup(props)
    const state = reactive({
      closed: false,
      prevActiveElement: null
    })
    const { modalAppendToBody } = toRefs(props)

    const isHorizontal = computed(() => {
      return props.direction === 'rtl' || props.direction === 'ltr'
    })

    onMounted(() => {
      if (visible.value) {
        rendered.value = true
        open()
      }
    })

    onUnmounted(() => {
      if (
        props.appendToBody &&
        instance.ctx.$el &&
        instance.ctx.$el.parentNode
      ) {
        instance.ctx.$el.parentNode.removeChild(instance.ctx.$el)
      }
    })

    watch(visible, (val) => {
      if (val) {
        state.closed = false
        emit('open')
        if (props.appendToBody) {
          document.body.appendChild(instance.ctx.$el)
        }
        state.prevActiveElement = document.activeElement
        nextTick(() => {
          Utils.focusFirstDescendant(drawer.value)
        })
      } else {
        if (!state.closed) emit('close')
        nextTick(() => {
          if (state.prevActiveElement) {
            state.prevActiveElement.focus()
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

    const hide = (cancel) => {
      if (cancel !== false) {
        emit('update:visible', false)
        emit('close')
        if (props.destroyOnClose === true) {
          rendered.value = false
        }
        state.closed = true
      }
    }
    const handleWrapperClick = () => {
      if (props.wrapperClosable) {
        closeDrawer()
      }
    }

    const closeDrawer = () => {
      if (typeof props.beforeClose === 'function') {
        props.beforeClose(hide)
      } else {
        hide()
      }
    }

    const handleClose = () => {
      // This method here will be called by PopupManger, when the `closeOnPressEscape` was set to true
      // pressing `ESC` will call this method, and also close the drawer.
      // This method also calls `beforeClose` if there was one.
      closeDrawer()
    }

    return {
      ...toRefs(state),
      rendered,
      visible,
      isHorizontal,
      afterEnter,
      afterLeave,
      hide,
      handleWrapperClick,
      closeDrawer,
      handleClose,
      drawer,
      modalAppendToBody
    }
  }
  // computed: {
  //   isHorizontal() {
  //     return this.direction === 'rtl' || this.direction === 'ltr'
  //   }
  // },
  // data() {
  //   return {
  //     closed: false,
  //     prevActiveElement: null
  //   }
  // },
  // watch: {
  //   visible(val) {
  //     if (val) {
  //       this.closed = false
  //       this.$emit('open')
  //       if (this.appendToBody) {
  //         document.body.appendChild(this.$el)
  //       }
  //       this.prevActiveElement = document.activeElement
  //       this.$nextTick(() => {
  //         Utils.focusFirstDescendant(this.$refs.drawer)
  //       })
  //     } else {
  //       if (!this.closed) this.$emit('close')
  //       this.$nextTick(() => {
  //         if (this.prevActiveElement) {
  //           this.prevActiveElement.focus()
  //         }
  //       })
  //     }
  //   }
  // },
  // methods: {
  //   afterEnter() {
  //     this.$emit('opened')
  //   },
  //   afterLeave() {
  //     this.$emit('closed')
  //   },
  //   hide(cancel) {
  //     if (cancel !== false) {
  //       this.$emit('update:visible', false)
  //       this.$emit('close')
  //       if (this.destroyOnClose === true) {
  //         this.rendered = false
  //       }
  //       this.closed = true
  //     }
  //   },
  //   handleWrapperClick() {
  //     if (this.wrapperClosable) {
  //       this.closeDrawer()
  //     }
  //   },
  //   closeDrawer() {
  //     if (typeof this.beforeClose === 'function') {
  //       this.beforeClose(this.hide)
  //     } else {
  //       this.hide()
  //     }
  //   },
  //   handleClose() {
  //     // This method here will be called by PopupManger, when the `closeOnPressEscape` was set to true
  //     // pressing `ESC` will call this method, and also close the drawer.
  //     // This method also calls `beforeClose` if there was one.
  //     this.closeDrawer()
  //   }
  // },
  // mounted() {
  //   if (this.visible) {
  //     this.rendered = true
  //     this.open()
  //   }
  // },
  // destroyed() {
  //   // if appendToBody is true, remove DOM node after destroy
  //   if (this.appendToBody && this.$el && this.$el.parentNode) {
  //     this.$el.parentNode.removeChild(this.$el)
  //   }
  // }
}
</script>
