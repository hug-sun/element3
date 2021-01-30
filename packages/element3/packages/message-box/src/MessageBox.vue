<template>
  <transition name="msgbox-fade">
    <div
      class="el-message-box__wrapper"
      tabindex="-1"
      v-show="state.visible"
      role="dialog"
      aria-modal="true"
      @click.self="handleWrapperClick"
      :aria-label="title || 'dialog'"
    >
      <div
        class="el-message-box"
        :class="[customClass, center && 'el-message-box--center']"
      >
        <div class="el-message-box__header" v-if="title !== null">
          <div class="el-message-box__title">
            <div
              :class="['el-message-box__status', icon]"
              v-if="icon && center"
            ></div>
            <span>{{ title }}</span>
          </div>
          <button
            type="button"
            class="el-message-box__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="
              handleAction(distinguishCancelAndClose ? 'close' : 'cancel')
            "
            @keydown.enter="
              handleAction(distinguishCancelAndClose ? 'close' : 'cancel')
            "
          >
            <i class="el-message-box__close el-icon-close"></i>
          </button>
        </div>
        <div class="el-message-box__content">
          <div class="el-message-box__container">
            <div
              :class="['el-message-box__status', icon]"
              v-if="icon && !center && changedMessage !== ''"
            ></div>
            <div class="el-message-box__message" v-if="changedMessage !== ''">
              <slot>
                <p v-if="!dangerouslyUseHTMLString && state.isVnode !== true">
                  {{ changedMessage }}
                </p>
                <p v-else v-html="changedMessage"></p>
              </slot>
            </div>
          </div>
          <div class="el-message-box__input" v-show="showInput">
            <el-input
              @keydown.enter="handleInputEnter"
              :type="inputType"
              v-model="state.inputValue"
              :placeholder="inputPlaceholder"
              ref="input"
            ></el-input>
            <div
              class="el-message-box__errormsg"
              :style="{
                visibility: !!state.editorErrorMessage ? 'visible' : 'hidden'
              }"
            >
              {{ state.editorErrorMessage }}
            </div>
          </div>
        </div>

        <div class="el-message-box__btns">
          <el-button
            :loading="cancelButtonLoading"
            :class="[cancelButtonClasses]"
            v-if="showCancelButton"
            :round="roundButton"
            size="small"
            @click="handleAction('cancel')"
            @keydown.enter="handleAction('cancel')"
          >
            {{ cancelButtonText || t('el.messagebox.cancel') }}
          </el-button>
          <el-button
            :loading="confirmButtonLoading"
            ref="confirm"
            :class="[confirmButtonClasses]"
            v-show="showConfirmButton"
            :round="roundButton"
            size="small"
            @click="handleAction('confirm')"
            @keydown.enter="handleAction('confirm')"
          >
            {{ confirmButtonText || t('el.messagebox.confirm') }}
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import {
  reactive,
  isVNode,
  toRefs,
  getCurrentInstance,
  nextTick,
  unref,
  computed,
  onMounted,
  onUnmounted,
  render,
  ref,
  watch
} from 'vue'
import { popupProps, usePopup } from '../../../src/composables/popup'
import Locale from '../../../src/mixins/locale'
import { ElInput } from '../../../src/components/Input'
import { ElButton } from '../../../src/components/Button'
import { addClass, removeClass } from '../../../src/utils/dom'
import { t } from '../../../src/locale'
import Dialog from '../../../src/utils/aria-dialog'

// let messageBox
const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
}

export default {
  mixins: [Locale],

  props: {
    ...popupProps,
    modal: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: null
    },
    message: {
      type: [Object, String],
      default() {
        return {}
      }
    },
    dangerouslyUseHTMLString: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'info',
      validator(val) {
        return ['success', 'warning', 'info', 'error'].indexOf(val)
      }
    },
    iconClass: {
      type: String,
      default: null
    },
    customClass: {
      type: String,
      default: null
    },
    callback: {
      type: Function,
      default: () => {}
    },
    showClose: {
      type: Boolean,
      default: true
    },
    beforeClose: {
      type: Function,
      default: () => {}
    },
    distinguishCancelAndClose: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: false
    },
    showConfirmButton: {
      type: Boolean,
      default: true
    },
    cancelButtonClass: {
      type: String,
      default: null
    },
    confirmButtonClass: {
      type: String,
      default: null
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    closeOnHashChange: {
      type: Boolean,
      default: true
    },
    showInput: {
      type: Boolean,
      default: false
    },
    inputPlaceholder: {
      type: String,
      default: ''
    },
    inputType: {
      type: String,
      default: 'text'
    },
    inputValue: {
      type: String,
      default: ''
    },
    inputPattern: {
      type: RegExp,
      default: null
    },
    inputValidator: {
      type: Function,
      default: () => {}
    },
    inputErrorMessage: {
      type: String,
      default: ''
    },
    center: {
      type: Boolean,
      default: false
    },
    roundButton: {
      type: Boolean,
      default: false
    },
    _type: {
      type: String,
      default: ''
    },
    cancelButtonLoading: {
      type: Boolean,
      default: false
    }
  },

  components: {
    ElInput,
    ElButton
  },
  setup(props, { attrs }) {
    const confirmButtonText = ref(attrs.confirmButtonText || '确认')
    const cancelButtonText = ref(attrs.cancelButtonText || '取消')

    let messageBox = ''
    const instance = getCurrentInstance()
    const {
      closeOnClickModal,
      distinguishCancelAndClose,
      _type,
      beforeClose,
      callback,
      type,
      iconClass,
      message,
      inputType,
      cancelButtonClass,
      confirmButtonClass,
      closeOnHashChange,
      lockScroll,
      inputPattern,
      inputValidator,
      inputValue
    } = toRefs(props)
    const state = reactive({
      visible: false,
      action: null,
      editorErrorMessage: null,
      uid: 0,
      inputValue: unref(inputValue),
      isVnode: false
    })
    const { rendered, open, close, restoreBodyStyle } = usePopup({
      ...toRefs(props),
      visible: state.visible
    })
    const validate = () => {
      if (unref(_type) === 'prompt') {
        const _inputPattern = unref(inputPattern)
        if (_inputPattern && !_inputPattern.test(state.inputValue || '')) {
          state.editorErrorMessage =
            state.inputErrorMessage || t('el.messagebox.error')
          addClass(getInputElement(), 'invalid')
          return false
        }
        const _inputValidator = unref(inputValidator)
        if (typeof _inputValidator === 'function') {
          const validateResult = _inputValidator(state.inputValue)
          if (validateResult === false) {
            state.editorErrorMessage =
              state.inputErrorMessage || t('el.messagebox.error')
            addClass(getInputElement(), 'invalid')
            return false
          }
          if (typeof validateResult === 'string') {
            state.editorErrorMessage = validateResult
            addClass(getInputElement(), 'invalid')
            return false
          }
        }
      }
      state.editorErrorMessage = ''
      removeClass(getInputElement(), 'invalid')
      return true
    }
    const doClose = () => {
      if (!state.visible) return
      state.visible = false
      rendered.value = false
      close()
      messageBox.closeDialog() // 解绑
      if (lockScroll) {
        setTimeout(restoreBodyStyle, 200)
      }
      nextTick(() => {
        if (state.action) {
          unref(callback)(state.action, instance.vnode)
        }
      })
    }
    const getSafeClose = () => {
      const currentId = state.uid
      return () => {
        nextTick(() => {
          if (currentId === state.uid) doClose()
        })
      }
    }
    const confirmButtonLoading = ref(false)
    const handleAction = (action) => {
      if (unref(_type) === 'prompt' && action === 'confirm' && !validate()) {
        return
      }
      state.action = action
      if (typeof unref(beforeClose) === 'function') {
        const close = getSafeClose()
        unref(beforeClose)(action, instance.vnode, close)
      } else {
        doClose()
      }
    }
    const handleWrapperClick = () => {
      if (unref(closeOnClickModal)) {
        handleAction(unref(distinguishCancelAndClose) ? 'close' : 'cancel')
      }
    }
    const handleKeyup = (element = {}) => {
      if (element.code !== 'Escape') return
      if (unref(props.closeOnPressEscape)) {
        handleAction(unref(distinguishCancelAndClose) ? 'close' : 'cancel')
      }
    }
    const handleInputEnter = () => {
      if (unref(inputType) !== 'textarea') {
        return handleAction('confirm')
      }
    }
    const icon = computed(() => {
      return (
        unref(iconClass) ||
        (unref(type) && typeMap[unref(type)]
          ? `el-icon-${typeMap[unref(type)]}`
          : '')
      )
    })
    const cancelButtonClasses = computed(() => {
      return `el-button--primary ${unref(cancelButtonClass)}`
    })
    const confirmButtonClasses = computed(() => {
      return `el-button--primary ${unref(confirmButtonClass)}`
    })
    const getFirstFocus = () => {
      const btn = instance.vnode.el.querySelector(
        '.el-message-box__btns .el-button'
      )
      const title = instance.vnode.el.querySelector(
        '.el-message-box__btns .el-message-box__title'
      )
      return btn || title
    }
    const getInputElement = () => {
      const inputRefs = instance.refs.input.$refs
      return inputRefs.input || inputRefs.textarea
    }
    onMounted(() => {
      state.visible = true
      nextTick(() => {
        state.uid++
        rendered.value = true
        open()
      })
      if (unref(_type) === 'alert' || unref(_type) === 'confirm') {
        nextTick(() => {
          instance.refs.confirm.$el.focus()
        })
      }
      const focusAfterClosed = document.activeElement
      messageBox = new Dialog(
        instance.vnode.el,
        focusAfterClosed,
        getFirstFocus()
      )
      if (unref(closeOnHashChange)) {
        window.addEventListener('hashchange', doClose)
      }
      window.addEventListener('keyup', handleKeyup)
      if (unref(_type) !== 'prompt') return
      setTimeout(() => {
        if (instance.refs.input && instance.refs.input.$el) {
          getInputElement().focus()
        }
      }, 500)
    })
    onUnmounted(() => {
      if (unref(closeOnHashChange)) {
        window.removeEventListener('hashchange', doClose)
      }
      window.removeEventListener('keyup', handleKeyup)
      setTimeout(() => {
        messageBox.closeDialog()
      })
    })

    const MessageToVNode = (message) => {
      let v = ''
      if (isVNode(unref(message))) {
        v = unref(message)
        render(v, document.createElement('div'))
        state.isVnode = true
        return v.el.innerHTML
      } else {
        state.isVnode = false
        return message
      }
    }
    watch(
      () => state.inputValue,
      (val) => {
        nextTick(() => {
          if (unref(_type) === 'prompt' && val !== null) {
            validate()
          }
        })
      }
    )
    return {
      ...toRefs(props),
      changedMessage: MessageToVNode(message),
      handleInputEnter,
      handleAction,
      state,
      handleWrapperClick,
      icon,
      cancelButtonClasses,
      cancelButtonText,
      t,
      confirmButtonLoading,
      confirmButtonClasses,
      confirmButtonText
    }
  }
}
</script>
