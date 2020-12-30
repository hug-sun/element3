<template>
  <transition name="msgbox-fade">
    <div
      v-show="visible"
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
              v-model="inputValue"
              :placeholder="inputPlaceholder"
              ref="input"
            ></el-input>
            <div
              :style="{
                visibility: !!editorErrorMessage ? 'visible' : 'hidden'
              }"
              class="el-message-box__errormsg"
            >
              {{ editorErrorMessage }}
            </div>
          </div>
        </div>
        <div class="el-message-box__btns">
          <el-button
            :loading="cancelButtonLoading"
            size="small"
            :round="roundButton"
            @click="handleAction('cancel')"
            @keydown.enter="handleAction('cancel')"
            :class="[cancelButtonClass]"
            v-show="showCancelButton"
          >
            {{ cancelButtonText }}
          </el-button>
          <el-button
            :loading="confirmButtonLoading"
            size="small"
            ref="confirm"
            :round="roundButton"
            @click="handleAction('confirm')"
            @keydown.enter="handleAction('confirm')"
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
  toRefs,
  getCurrentInstance,
  nextTick,
  unref,
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'
import propsObject from './props.js'
import { isFunction } from '@vue/shared'
import { usePopup } from '../../../use/popup'
import { ElInput } from '../../Input'
import { ElButton } from '../../Button'
import { addClass, removeClass } from '../../../utils/dom'

export default defineComponent({
  props: propsObject,
  components: {
    ElInput,
    ElButton
  },
  setup(props) {
    const state = reactive({
      action: null,
      visible: true,
      ...props
    })
    const instance = getCurrentInstance()
    const { iconClass, type } = toRefs(state)
    const { validate, editorErrorMessage } = validateFunction(state, instance)
    const {
      closeHandle,
      handleAction,
      handleInputEnter,
      handleWrapperClick
    } = handleList(state, instance, validate)
    const confirmButtonLoading = ref(false)
    const icon = computed(() => {
      return unref(iconClass) || (unref(type) ? `el-icon-${unref(type)}` : '')
    })
    return {
      ...toRefs(state),
      editorErrorMessage,
      icon,
      handleAction,
      handleInputEnter,
      handleWrapperClick,
      closeHandle,
      confirmButtonLoading
    }
    function handleList(state, instance, validate) {
      const { open, close } = usePopup(state)
      const {
        visible,
        callback,
        category,
        inputType,
        closeOnHashChange,
        closeOnPressEscape,
        distinguishCancelAndClose,
        closeOnClickModal,
        action,
        beforeClose
      } = toRefs(state)
      const closeHandle = () => {
        visible.value = false
        close()
        nextTick(() => {
          unref(callback)(state.action, instance.proxy)
        })
      }
      const handleAction = (_action) => {
        if (
          unref(category) === 'prompt' &&
          _action === 'confirm' &&
          !validate()
        ) {
          return
        }
        action.value = _action
        if (isFunction(beforeClose.value)) {
          beforeClose.value(_action, instance.proxy, closeHandle)
        } else {
          closeHandle()
        }
      }
      const handleKeyup = (element = {}) => {
        if (element.code !== 'Escape') return
        if (unref(closeOnPressEscape)) {
          handleAction(unref(distinguishCancelAndClose) ? 'close' : 'cancel')
        }
      }
      const handleInputEnter = () => {
        if (unref(inputType) !== 'textarea') {
          return handleAction('confirm')
        }
      }

      const handleWrapperClick = () => {
        if (unref(closeOnClickModal)) {
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
      return {
        closeHandle,
        handleAction,
        handleWrapperClick,
        handleInputEnter
      }
    }
    function validateFunction(state, instance) {
      const editorErrorMessage = ref(null)
      const {
        category,
        inputPattern,
        inputValue,
        inputValidator,
        inputErrorMessage
      } = toRefs(state)
      const getInputElement = () => {
        const inputRefs = instance.refs.input.$refs
        return inputRefs.input || inputRefs.textarea
      }

      const validate = () => {
        if (unref(category) === 'prompt') {
          if (
            unref(inputPattern) &&
            !unref(inputPattern).test(unref(inputValue))
          ) {
            editorErrorMessage.value = unref(inputErrorMessage)

            addClass(getInputElement(), 'invalid')
            return false
          }
          const _inputValidator = unref(inputValidator)
          if (typeof _inputValidator === 'function') {
            const validateResult = _inputValidator(unref(inputValue))
            if (validateResult === false) {
              editorErrorMessage.value = unref(inputErrorMessage)
              addClass(getInputElement(), 'invalid')
              return false
            }
            if (typeof validateResult === 'string') {
              editorErrorMessage.value = validateResult
              addClass(getInputElement(), 'invalid')
              return false
            }
          }
        }
        editorErrorMessage.value = ''
        removeClass(getInputElement(), 'invalid')
        return true
      }
      watch(inputValue, (val) => {
        nextTick(() => {
          if (unref(category) === 'prompt' && val !== null) {
            validate()
          }
        })
      })
      return {
        validate,
        editorErrorMessage
      }
    }
  }
})
</script>
