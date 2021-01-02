import { mount } from '@vue/test-utils'
import { nextTick, h, ref } from 'vue'
import MessageBox from '../src/MessageBox.vue'
describe('MessageBox.vue', () => {
  describe('snapshot', () => {
    const wrapper = mount(MessageBox)
    expect(wrapper.element).toMatchSnapshot()
  })
  describe('proprety', () => {
    it('proprety title', () => {
      const warpper = mount(MessageBox, {
        props: {
          title: 'chushihua'
        }
      })
      expect(warpper.find('.el-message-box__title').text()).toBe('chushihua')
    })
    it('proprety center', () => {
      const warpper = mount(MessageBox, {
        props: {
          center: true
        }
      })
      expect(warpper.find('.el-message-box--center').exists()).toBeTruthy()
    })
    it('proprety customClass', () => {
      const warpper = mount(MessageBox, {
        props: {
          customClass: 'customClass'
        }
      })
      expect(warpper.find('.customClass').exists()).toBeTruthy()
    })
    it('proprety iconClass', () => {
      const warpper = mount(MessageBox, {
        props: {
          iconClass: 'iconClass'
        }
      })
      expect(warpper.vm.icon).toBe('iconClass')
    })
    it('iconclass with center', () => {
      const warpper = mount(MessageBox, {
        props: {
          iconClass: 'iconClass',
          center: true,
          title: 'title'
        }
      })
      expect(warpper.find('.iconClass').exists()).toBeTruthy()
    })
    it('proprety type', () => {
      const warpper = mount(MessageBox, {
        props: {
          title: 'title',
          center: true
        }
      })

      expect(warpper.find('.el-icon-info').exists()).toBeTruthy()
    })
    it('showClose', () => {
      const warpper = mount(MessageBox, {
        props: {
          title: '12',
          showClose: false
        }
      })
      expect(warpper.find('.el-message-box__headerbtn').exists()).toBeFalsy()
    })
    it('showClose toBeTruthy', () => {
      const warpper = mount(MessageBox, {
        props: {
          title: '12'
        }
      })
      expect(warpper.find('.el-message-box__headerbtn').exists()).toBeTruthy()
    })
    it('proprety beforeClose', async () => {
      let object = {}
      const warpper = mount(MessageBox, {
        props: {
          title: '12',
          beforeClose: (action, instance, done) => {
            object.action = action
            object.instance = instance
            object.done = done
          }
        }
      })
      await warpper.find('.el-message-box__headerbtn').trigger('click')
      expect(warpper.componentVM).toEqual(object.instance)
      expect(object.action).toBe('cancel')
    })
    it('review messageBox when value was done', async () => {
      const warpper = mount(MessageBox, {
        props: {
          title: '12',
          beforeClose: (action, instance, done) => {
            done()
          }
        }
      })
      await warpper.find('.el-message-box__headerbtn').trigger('click')
      expect(warpper.find('.el-message-box__headerbtn').isVisible()).toBeFalsy()
      expect(warpper.find('.v-modal').exists()).toBeFalsy()
    })
    it('showClose lockScroll', () => {
      document.body.classList.remove('el-popup-parent--hidden')
      mount(MessageBox, {
        props: {
          title: '12',
          lockScroll: false
        },
        attachTo: document.getElementById('body')
      })
      expect(document.body.className).not.toBe('el-popup-parent--hidden')
    })
    it('meesage of normal', () => {
      const warpper = mount(MessageBox, {
        props: {
          message: '333'
        }
      })
      expect(warpper.find('.el-message-box__message > p').text()).toBe('333')
    })
    it('meesage is VNode', () => {
      const v = h('p', null, [
        h('span', null, '内容可以是 '),
        h('i', { style: 'color: teal' }, 'VNode')
      ])
      const wrapper = mount(MessageBox, {
        slots: {
          default: v
        }
      })
      expect(wrapper.componentVM.$slots.default()[0]).toEqual(v)
    })
    it('dangerouslyUseHTMLString', () => {
      const warpper = mount(MessageBox, {
        props: {
          dangerouslyUseHTMLString: true,
          message: '<div class="mmm">444</div>'
        }
      })
      expect(warpper.find('.mmm').exists()).toBeTruthy()
    })
    it('handleInputEnter', async () => {
      const warpper = mount(MessageBox, {
        props: {
          inputType: 'texg'
        }
      })
      warpper.componentVM.handleInputEnter()
      await nextTick()
      expect(warpper.componentVM.visible).toBeFalsy()
    })
    it('closeOnPressEscape', async () => {
      const warpper = mount(MessageBox, {
        props: {
          closeOnPressEscape: true
        }
      })
      const event = new KeyboardEvent('keyup', {
        code: 'Escape'
      })
      window.dispatchEvent(event)
      expect(warpper.find('.el-message-box__wrapper').isVisible()).toBeTruthy()
      expect(warpper.componentVM.visible).toBeFalsy()
    })
    it('handleWrapperClick', async () => {
      const warpper = mount(MessageBox, {
        props: {
          closeOnClickModal: true
        }
      })
      await warpper.find('.el-message-box__wrapper').trigger('click')
      await nextTick()
      expect(warpper.componentVM.action).toBe('cancel')
    })
    it('closeOnHashChange', async () => {
      const warpper = mount(MessageBox, {
        props: {
          closeOnHashChange: true
        }
      })
      window.dispatchEvent(new Event('hashchange'))
      expect(warpper.find('.el-message-box__wrapper').isVisible()).toBeTruthy()
      expect(warpper.componentVM.visible).toBeFalsy()
    })

    it('showInput', () => {
      const warpper = mount(MessageBox, {
        props: {
          showInput: true
        }
      })
      expect(warpper.find('.el-message-box__input').isVisible()).toBeTruthy()
    })
    it('inputValue inputPlaceholder', () => {
      const warpper = mount(MessageBox, {
        props: {
          showInput: true,
          inputValue: '444',
          inputPlaceholder: '555'
        }
      })
      expect(warpper.find('.el-input__inner').element.value).toEqual('444')
      expect(
        warpper.find('.el-input__inner').attributes('placeholder')
      ).toEqual('555')
    })

    it('cancelButtonText, showCancelButton', () => {
      const warpper = mount(MessageBox, {
        props: {
          cancelButtonText: 'cancel',
          showCancelButton: true,
          cancelButtonClass: 'vvv'
        }
      })
      expect(warpper.find('.vvv').text()).toEqual('cancel')
      expect(warpper.find('.vvv').isVisible()).toBeTruthy()
    })

    it('confirmButtonClass showConfirmButton, confirmButtonText', () => {
      const warpper = mount(MessageBox, {
        props: {
          confirmButtonText: 'cancel',
          showConfirmButton: true,
          confirmButtonClass: 'mmm'
        }
      })
      expect(warpper.find('.el-button--primary').classes()).toContain('mmm')
      expect(warpper.find('.mmm').text()).toEqual('cancel')
      expect(warpper.find('.el-message-box__btns').isVisible()).toBeTruthy()
    })

    it('proprety callback', async () => {
      let object = ref(null)
      const warpper = mount(MessageBox, {
        props: {
          title: '12',
          callback(action) {
            object.value = action
          }
        }
      })
      await warpper.find('.el-message-box__headerbtn').trigger('click')
      await nextTick()
      expect(object.value).toBe('cancel')
    })
    it('validate correct', async () => {
      const warpper = mount(MessageBox, {
        props: {
          title: '12',
          category: 'prompt',
          inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      })
      await warpper.findComponent({ ref: 'input' }).setValue('2323')
      await nextTick()
      expect(warpper.componentVM.editorErrorMessage).toBe('输入的数据不合法!')
      expect(warpper.find('.el-input__inner').classes()).toHaveLength(2)
    })
    it('validate fail', async () => {
      const warpper = mount(MessageBox, {
        props: {
          title: '12',
          category: 'prompt',
          inputValidator() {
            return '失败'
          },
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      })
      await warpper.findComponent({ ref: 'input' }).setValue('2323')
      await nextTick()
      expect(warpper.find('.el-input__inner').classes()).toHaveLength(2)
      expect(warpper.componentVM.editorErrorMessage).toBe('失败')
    })
    it('inputValidator', async () => {
      const warpper = mount(MessageBox, {
        props: {
          title: '12',
          category: 'prompt',
          inputValidator() {
            return false
          },
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      })
      await warpper.findComponent({ ref: 'input' }).setValue('2323')
      await nextTick()
      expect(warpper.find('.el-input__inner').classes()).toHaveLength(2)
    })
  })
  describe('test modal closeOnClickModal', () => {
    it('open modal', async () => {
      const warpper = mount(MessageBox, {
        props: {
          modal: true,
          closeOnClickModal: true
        }
      })
      await nextTick()
      expect(warpper.find('.v-modal').exists()).toBeTruthy()

      await warpper.find('.v-modal').trigger('click')
      await nextTick()
      expect(warpper.find('.v-moda').exists()).toBeFalsy()
    })
    it('open modal', async () => {
      const warpper = mount(MessageBox, {
        props: {
          modal: true,
          closeOnClickModal: true
        }
      })
      await nextTick()
      expect(warpper.find('.v-modal').exists()).toBeTruthy()

      await warpper.find('.v-modal').trigger('keyup', { keyCode: 'Escape' })
      await nextTick()
      expect(warpper.find('.v-moda').exists()).toBeFalsy()
    })
    it('open modal', async () => {
      const warpper = mount(MessageBox, {
        props: {
          modal: true,
          closeOnClickModal: true
        }
      })
      await nextTick()
      expect(warpper.find('.v-modal').exists()).toBeTruthy()

      await warpper.find('.v-modal').trigger('hashchange')
      await nextTick()
      expect(warpper.find('.v-moda').exists()).toBeFalsy()
    })
  })
})
