import { nextTick, ref, onBeforeMount, getCurrentInstance, onBeforeUnmount, toRef, watch } from 'vue'
import merge from 'element-ui/src/utils/merge'
import PopupManager from 'element-ui/src/utils/popup/popup-manager'
import getScrollBarWidth from '../scrollbar-width'
import { getStyle, addClass, removeClass, hasClass } from '../dom'

let idSeed = 1;
let scrollBarWidth;
const popupProps = {
  visible: {
    type: Boolean,
    default: false
  },
  openDelay: {},
  closeDelay: {},
  zIndex: {},
  modal: {
    type: Boolean,
    default: false
  },
  modalFade: {
    type: Boolean,
    default: true
  },
  modalClass: {},
  modalAppendToBody: {
    type: Boolean,
    default: false
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: false
  },
  closeOnClickModal: {
    type: Boolean,
    default: false
  }
};

function usePopup(props) {
  const {
    openDelay,
    visible,
    modal,
    modalAppendToBody,
    modalClass,
    modalFade,
    lockScroll,
    zIndex
  } = toRef(props);
  const opened = ref(false);
  const bodyPaddingRight = ref(null);
  const computedBodyPaddingRight = ref(0);
  const withoutHiddenClass = ref(true);
  const rendered = ref(false);
  const instance = getCurrentInstance();
  let _popupId = 0;
  let _closeTimer = 0;
  let _openTimer = 0;
  let _opening = false;
  let _closing = true;
  const open = () => {
    if (!rendered.value) {
      rendered.value = true
    }
    if (_closeTimer) {
      clearTimeout(_closeTimer)
      _closeTimer = 0
    }
    clearTimeout(_openTimer)

    const delay = Number(openDelay.value)
    if (delay > 0) {
      _openTimer = setTimeout(() => {
        _openTimer = 0;
        doOpen()
      }, delay)
    } else {
      doOpen()
    }
  };
  const doOpen = () => {
    if (instance.ctx.$isServer) return
    if (_opening) return
    if (opened.value) return
    _opening = true
    const dom = instance.ctx.$el;
    if (zIndex.value) {
      PopupManager.zIndex = zIndex.value
    }
    if (modal.value) {
      if (_closing) {
        PopupManager.closeModal(_popupId)
        _closing = false
      }
      PopupManager.openModal(_popupId, PopupManager.nextZIndex(), modalAppendToBody.value ? undefined : dom, modalClass.value, modalFade.value)
      if (lockScroll.value) {
        withoutHiddenClass.value = !hasClass(document.body, 'el-popup-parent--hidden')
        if (withoutHiddenClass.value) {
          bodyPaddingRight.value = document.body.style.paddingRight
          computedBodyPaddingRight.value = parseInt(getStyle(document.body, 'paddingRight'), 10)
        }
        scrollBarWidth = getScrollBarWidth()
        let bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight
        let bodyOverflowY = getStyle(document.body, 'overflowY')
        if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll') && withoutHiddenClass.value) {
          document.body.style.paddingRight = computedBodyPaddingRight.value + scrollBarWidth + 'px'
        }
        addClass(document.body, 'el-popup-parent--hidden')
      }
    }

    if (getComputedStyle(dom).position === 'static') {
      dom.style.position = 'absolute'
    }

    dom.style.zIndex = PopupManager.nextZIndex()
    opened.value = true
    instance.onOpen &&  instance.onOpen();
    doAfterOpen()
  };
  const doAfterOpen = () => {
    _opening = false
  };
  const close = () => {
    if (_closing) return
    if (_openTimer) {
      clearTimeout(_openTimer)
      _openTimer = 0;
    }
    clearTimeout(_closeTimer)
    const delay = Number(closeDelay.value)
    if (delay > 0) {
      _closeTimer = setTimeout(() => {
        _closeTimer = 0;
        doClose()
      }, delay)
    } else {
      doClose()
    }
  };
  const doClose=()=>{
    _closing = true
    instance.onClose && instance.onClose()
    if (lockScroll.value) {
      setTimeout(restoreBodyStyle, 200)
    }
    opened.value = false;
    doAfterClose()
  };
  const doAfterClose=()=>{
    PopupManager.closeModal(_popupId)
    _closing = false
  };
  const restoreBodyStyle = () => {
    if (modal.value && withoutHiddenClass.value) {
      document.body.style.paddingRight = this.bodyPaddingRight.value
      removeClass(document.body, 'el-popup-parent--hidden')
    }
    withoutHiddenClass.value = true
  };
  watch(visible,(val)=>{
    if (val) {
      if (_opening) return
      if (!rendered.value) {
        rendered.value = true
        nextTick(() => {
          open()
        })
      } else {
        open()
      }
    } else {
      close()
    }
  });
  onBeforeMount(() => {
    _popupId = 'popup-' + idSeed++;
    PopupManager.register(_popupId, instance)
  });
  onBeforeUnmount(() => {
    PopupManager.deregister(_popupId);
    PopupManager.closeModal(_popupId);
    restoreBodyStyle();
  })
}

export default {

  watch: {
    visible(val) {
      if (val) {
        if (this._opening) return
        if (!this.rendered) {
          this.rendered = true
          nextTick(() => {
            this.open()
          })
        } else {
          this.open()
        }
      } else {
        this.close()
      }
    }
  },

  methods: {
    open(options) {
      if (!this.rendered) {
        this.rendered = true
      }

      const props = merge({}, this.$props || this, options)

      if (this._closeTimer) {
        clearTimeout(this._closeTimer)
        this._closeTimer = null
      }
      clearTimeout(this._openTimer)

      const openDelay = Number(props.openDelay)
      if (openDelay > 0) {
        this._openTimer = setTimeout(() => {
          this._openTimer = null
          this.doOpen(props)
        }, openDelay)
      } else {
        this.doOpen(props)
      }
    },

    doOpen(props) {
      if (this.$isServer) return
      if (this.willOpen && !this.willOpen()) return
      if (this.opened) return

      this._opening = true

      const dom = this.$el

      const modal = props.modal

      const zIndex = props.zIndex
      if (zIndex) {
        PopupManager.zIndex = zIndex
      }

      if (modal) {
        if (this._closing) {
          PopupManager.closeModal(this._popupId)
          this._closing = false
        }
        PopupManager.openModal(this._popupId, PopupManager.nextZIndex(), this.modalAppendToBody ? undefined : dom, props.modalClass, modalFade)
        if (props.lockScroll) {
          withoutHiddenClass.value = !hasClass(document.body, 'el-popup-parent--hidden')
          if (withoutHiddenClass.value) {
            bodyPaddingRight.value = document.body.style.paddingRight
            computedBodyPaddingRight.value = parseInt(getStyle(document.body, 'paddingRight'), 10)
          }
          scrollBarWidth = getScrollBarWidth()
          let bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight
          let bodyOverflowY = getStyle(document.body, 'overflowY')
          if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll') && this.withoutHiddenClass) {
            document.body.style.paddingRight = this.computedBodyPaddingRight + scrollBarWidth + 'px'
          }
          addClass(document.body, 'el-popup-parent--hidden')
        }
      }

      if (getComputedStyle(dom).position === 'static') {
        dom.style.position = 'absolute'
      }

      dom.style.zIndex = PopupManager.nextZIndex()
      this.opened = true

      this.onOpen && this.onOpen()

      this.doAfterOpen()
    },

    doAfterOpen() {
      this._opening = false
    },

    close() {
      if (this.willClose && !this.willClose()) return

      if (_openTimer) {
        clearTimeout(_openTimer)
        _openTimer = 0;
      }
      clearTimeout(_closeTimer)

      const closeDelay = Number(this.closeDelay)

      if (closeDelay > 0) {
        this._closeTimer = setTimeout(() => {
          this._closeTimer = null
          this.doClose()
        }, closeDelay)
      } else {
        this.doClose()
      }
    },

    doClose() {
      this._closing = true

      this.onClose && this.onClose()

      if (this.lockScroll) {
        setTimeout(this.restoreBodyStyle, 200)
      }

      this.opened = false

      this.doAfterClose()
    },

    doAfterClose() {
      PopupManager.closeModal(this._popupId)
      this._closing = false
    },

    restoreBodyStyle() {
      if (this.modal && this.withoutHiddenClass) {
        document.body.style.paddingRight = this.bodyPaddingRight
        removeClass(document.body, 'el-popup-parent--hidden')
      }
      this.withoutHiddenClass = true
    }
  }
}

export {
  popupProps,
  usePopup
}
