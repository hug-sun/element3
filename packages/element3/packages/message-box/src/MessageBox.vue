<template>
  <transition name="msgbox-fade">
    <div
      v-show="state.visible"
      class="el-message-box__wrapper"
      tabindex="-1"
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
            @click="handleAction('cancel')"
            @keydown.enter="handleAction('cancel')"
          >
            <i class="el-message-box__close el-icon-close"></i>
          </button>
        </div>
        <div class="el-message-box__content">
          <div class="el-message-box__container">
            <div
              :class="['el-message-box__status', icon]"
              v-if="icon && !center && message !== ''"
            ></div>
            <div class="el-message-box__message" v-if="message !== ''">
              <slot>
                <p v-if="!dangerouslyUseHTMLString">
                  {{ message }}
                </p>

                <p v-else v-html="message"></p>
              </slot>
            </div>
          </div>
          <div class="el-message-box__input" v-show="showInput">
            <el-input
              @keydown.enter="handleInputEnter"
              :type="inputType"
              v-model="modelValue"
              :placeholder="inputPlaceholder"
              ref="input"
            ></el-input>
            <div class="el-message-box__errormsg">
              <!-- :style="{
                visibility: !!state.editorErrorMessage ? 'visible' : 'hidden'
              }" -->
              {{ editorErrorMessage }}
            </div>
          </div>
        </div>
        <div class="el-message-box__btns">
          <el-button
            :loading="cancelButtonLoading"
            size="small"
            :round="roundButton"
            @click="
              handleAction(distinguishCancelAndClose ? 'close' : 'cancel')
            "
            @keydown.enter="
              handleAction(distinguishCancelAndClose ? 'close' : 'cancel')
            "
            :class="['el-button--primary', cancelButtonClass]"
            v-show="showCancelButton"
          >
            {{ cancelButtonText }}
          </el-button>
          <el-button
            :loading="cancelButtonLoading"
            size="small"
            :round="roundButton"
            @click="handleAction('cancel')"
            @keydown.enter="handleAction('cancel')"
            :class="['el-button--primary', confirmButtonClass]"
            v-show="showConfirmButton"
          >
            {{ confirmButtonText }}
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import {
  defineComponent,
  reactive,
  isVNode,
  toRefs,
  getCurrentInstance,
  nextTick,
  unref,
  render,
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'
import { isFunction } from '@vue/shared'
import { popupProps, usePopup } from '../../../src/use/popup'
import Locale from '../../../src/mixins/locale'
import ElInput from '../../input'
import { ElButton } from '../../../src/components/Button'
import { addClass, removeClass } from '../../../src/utils/dom'
import { t } from '../../../src/locale'

export default defineComponent({
  mixins: [Locale],

  props: {
    closeOnHashChange: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    distinguishCancelAndClose: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    cancelButtonLoading: {
      type: Boolean,
      default: false
    },
    roundButton: {
      type: Boolean,
      default: false
    },
    cancelButtonClass: {
      type: String,
      default: null
    },
    confirmButtonClass: {
      type: String,
      default: null
    },
    showCancelButton: {
      type: Boolean,
      default: false
    },
    showConfirmButton: {
      type: Boolean,
      default: false
    },
    confirmButtonText: {
      type: String,
      default: () => t('el.messagebox.cancel')
    },
    cancelButtonText: {
      type: String,
      default: () => t('el.messagebox.confirm')
    },
    category: {
      type: String,
      default: 'alert',
      validator(val) {
        return ['confirm', 'prompt', 'alert'].indexOf(val)
      }
    },
    inputValue: {
      type: String,
      default: ''
    },
    inputPlaceholder: {
      type: String,
      default: ''
    },
    inputType: {
      type: String,
      default: 'text'
    },
    showInput: {
      type: Boolean,
      default: false
    },
    dangerouslyUseHTMLString: {
      type: Boolean,
      default: false
    },
    message: {
      type: [Object, String],
      default() {
        return {}
      }
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    center: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    customClass: {
      type: String,
      default: null
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
    showClose: {
      type: Boolean,
      default: true
    },
    beforeClose: {
      type: Function,
      default: null
    }
  },

  components: {
    ElInput,
    ElButton
  },
  emits: ['update:visible'],
  setup(props, { attrs, emit }) {
    const state = reactive({
      action: null,
      visible: true
    })
    const instance = getCurrentInstance()
    const {
      iconClass,
      type,
      beforeClose,
      inputType,
      inputValue,
      category,
      closeOnClickModal,
      distinguishCancelAndClose,
      closeOnPressEscape,
      closeOnHashChange
    } = toRefs(props)
    const { open, close } = usePopup(
      reactive({
        visible: state.visible,
        ...toRefs(props)
      })
    )
    const icon = computed(() => {
      return unref(iconClass) || (unref(type) ? `el-icon-${unref(type)}` : '')
    })
    const closeHandle = () => {
      state.visible = false
      close()
    }
    const handleAction = (action) => {
      if (isFunction(beforeClose.value)) {
        beforeClose.value(action, instance.proxy, closeHandle)
      } else {
        closeHandle()
      }
    }
    const handleInputEnter = () => {
      if (unref(inputType) !== 'textarea') {
        return handleAction('confirm')
      }
    }
    const handleKeyup = (element = {}) => {
      if (element.code !== 'Escape') return
      if (unref(closeOnPressEscape)) {
        handleAction(unref(distinguishCancelAndClose) ? 'close' : 'cancel')
      }
    }
    onMounted(() => {
      if (unref(closeOnHashChange)) {
        window.addEventListener('hashchange', closeHandle)
      }
      window.addEventListener('keyup', handleKeyup)
      nextTick(() => {
        open()
      })
    })
    onUnmounted(() => {
      if (unref(closeOnHashChange)) {
        window.removeEventListener('hashchange', closeHandle)
      }
      window.removeEventListener('keyup', handleKeyup)
    })

    const modelValue = ref(inputValue)
    const editorErrorMessage = ref(null)
    const getInputElement = () => {
      const inputRefs = instance.refs.input.$refs
      return inputRefs.input || inputRefs.textarea
    }
    const validate = () => {
      state.editorErrorMessage = ''
      removeClass(getInputElement(), 'invalid')
      return true
    }
    watch(modelValue, (val) => {
      nextTick(() => {
        if (unref(category) === 'prompt' && val !== null) {
          validate()
        }
      })
    })

    const handleWrapperClick = () => {
      if (unref(closeOnClickModal)) {
        handleAction(unref(distinguishCancelAndClose) ? 'close' : 'cancel')
      }
    }
    return {
      modelValue,
      state,
      icon,
      handleAction,
      handleInputEnter,
      editorErrorMessage,
      handleWrapperClick
    }
  }
})
</script>
