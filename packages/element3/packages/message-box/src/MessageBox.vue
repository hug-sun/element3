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
            @click="handleAction('cancel')"
            @keydown.enter="handleAction('cancel')"
            :class="['el-button--primary', cancelButtonClass]"
            v-show="showCancelButton"
          >
            {{ cancelButtonText }}
          </el-button>
          <el-button
            :loading="confirmButtonLoading"
            size="small"
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
import propsObject from './prop/prop'
import { isFunction } from '@vue/shared'
import { popupProps, usePopup } from '../../../src/use/popup'
import Locale from '../../../src/mixins/locale'
import ElInput from '../../input'
import { ElButton } from '../../../src/components/Button'
import { addClass, removeClass } from '../../../src/utils/dom'

export default defineComponent({
  mixins: [Locale],

  components: {
    ElInput,
    ElButton
  },
  setup(props, { attrs }) {
    const b = Object.assign(propsObject(), attrs)
    console.log(b)
    const state = reactive({
      action: null,
      visible: true,
      ...b
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
      closeOnHashChange,
      callback
    } = toRefs(state)

    const { open, close } = usePopup(state)
    const icon = computed(() => {
      console.log('type', iconClass.value)
      return unref(iconClass) || (unref(type) ? `el-icon-${unref(type)}` : '')
    })
    const closeHandle = () => {
      state.visible = false
      close()
      nextTick(() => {
        unref(callback)(state.action, instance)
      })
    }
    const handleAction = (action) => {
      if (unref(category) === 'prompt' && action === 'confirm' && !validate()) {
        return
      }
      state.action = action
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

    const modelValue = ref(inputValue.value)
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
    const confirmButtonLoading = ref(false)
    return {
      modelValue,
      ...toRefs(state),
      icon,
      handleAction,
      handleInputEnter,
      editorErrorMessage,
      handleWrapperClick,
      closeHandle,
      confirmButtonLoading
    }
  }
})
</script>
