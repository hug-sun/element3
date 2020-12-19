<template>
  <transition name="msgbox-fade">
    <div
      v-show="state.visible"
      class="el-message-box__wrapper"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
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
              v-if="icon && !center && getMessage.message !== ''"
            ></div>
            <div
              class="el-message-box__message"
              v-if="getMessage.message !== ''"
            >
              <slot>
                <p v-if="getMessage.isVnode !== true">
                  {{ getMessage.message }}
                </p>
                <p v-else v-html="getMessage.message"></p>
              </slot>
            </div>
          </div>
          <!-- <div class="el-message-box__input" v-show="showInput">
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
          </div> -->
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
      default: () => {}
    }
  },

  components: {
    // ElInput,
    // ElButton
  },
  emits: ['update:visible'],
  setup(props, { attrs, emit }) {
    const state = reactive({
      action: null,
      visible: true
    })
    const instance = getCurrentInstance()
    const { iconClass, type, beforeClose } = toRefs(props)
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
    const getMessage = (message) => {
      return isVNode(message)
        ? {
            message: getHTMLInner(message),
            isVNode: true
          }
        : {
            message: message,
            isVNode: false
          }
    }
    onMounted(() => {
      nextTick(() => {
        open()
      })
    })
    return {
      state,
      icon,
      handleAction,
      getMessage: getMessage(props.message)
    }
    function getHTMLInner(vnode) {
      let element = vnode
      render(element, document.createElement('div'))
      return element.el.innerHTML
    }
  }
})
</script>
