import { mount } from '@vue/test-utils'
import { nextTick, h, ref } from 'vue'
import MessageBox from '../src/MessageBox.vue'
describe('MessageBox.vue', () => {
  describe('proprety', () => {
    it('proprety title', () => {
      const warpper = mount(MessageBox, {
        attrs: {
          title: 'chushihua'
        }
      })
      expect(warpper.find('.el-message-box__title').text()).toBe('chushihua')
    })
    it('proprety center', () => {
      const warpper = mount(MessageBox, {
        attrs: {
          center: true
        }
      })
      expect(warpper.find('.el-message-box--center').exists()).toBeTruthy()
    })
    it('proprety customClass', () => {
      const warpper = mount(MessageBox, {
        attrs: {
          customClass: 'customClass'
        }
      })
      expect(warpper.find('.customClass').exists()).toBeTruthy()
    })
    it('proprety iconClass', () => {
      const warpper = mount(MessageBox, {
        attrs: {
          iconClass: 'iconClass'
        }
      })
      expect(warpper.vm.icon).toBe('iconClass')
    })
    it('iconclass with center', () => {
      const warpper = mount(MessageBox, {
        attrs: {
          iconClass: 'iconClass',
          center: true,
          title: 'title'
        }
      })
      expect(warpper.find('.iconClass').exists()).toBeTruthy()
    })
    it('proprety type', () => {
      const warpper = mount(MessageBox, {
        attrs: {
          title: 'title',
          center: true
        }
      })

      expect(warpper.find('.el-icon-info').exists()).toBeTruthy()
    })
    it('showClose', () => {
      const warpper = mount(MessageBox, {
        attrs: {
          title: '12',
          showClose: false
        }
      })
      expect(warpper.find('.el-message-box__headerbtn').exists()).toBeFalsy()
    })
    it('showClose toBeTruthy', () => {
      const warpper = mount(MessageBox, {
        attrs: {
          title: '12'
        }
      })
      expect(warpper.find('.el-message-box__headerbtn').exists()).toBeTruthy()
    })
    it('proprety beforeClose', async () => {
      let object = {}
      const warpper = mount(MessageBox, {
        attrs: {
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
        attrs: {
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
        attrs: {
          title: '12',
          lockScroll: false
        },
        attachTo: document.getElementById('body')
      })
      expect(document.body.className).not.toBe('el-popup-parent--hidden')
    })
    it('meesage of normal', () => {
      const warpper = mount(MessageBox, {
        attrs: {
          message: '333'
        }
      })
      expect(warpper.find('.el-message-box__message > p').text()).toBe('333')
    })
    it('meesage is VNode', () => {
      const warpper = mount(MessageBox, {
        slots: {
          default: h('p', null, [
            h('span', null, '内容可以是 '),
            h('i', { style: 'color: teal' }, 'VNode')
          ])
        }
      })

      expect(warpper.find('.el-message-box__message > p').text()).toBe(
        `内容可以是 VNode`
      )
    })
    it('dangerouslyUseHTMLString', () => {
      const warpper = mount(MessageBox, {
        attrs: {
          dangerouslyUseHTMLString: true,
          message: '<div class="mmm">444</div>'
        }
      })
      expect(warpper.find('.mmm').exists()).toBeTruthy()
    })
    it('showInput', () => {
      const warpper = mount(MessageBox, {
        attrs: {
          showInput: true
        }
      })
      expect(warpper.find('.el-message-box__input').isVisible()).toBeTruthy()
    })
    it('inputValue inputPlaceholder', () => {
      const warpper = mount(MessageBox, {
        attrs: {
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
        attrs: {
          cancelButtonText: 'cancel',
          showCancelButton: true,
          cancelButtonClass: '4444'
        }
      })
      expect(warpper.findAll('.el-message-box__btns button')[0].text()).toEqual(
        'cancel'
      )
      expect(
        warpper.findAll('.el-message-box__btns button')[0].isVisible()
      ).toBeTruthy()
      expect(
        warpper.findAll('.el-button--primary')[0].element.classList
      ).toContain('4444')
    })

    it('confirmButtonClass showConfirmButton, confirmButtonText', () => {
      const warpper = mount(MessageBox, {
        attrs: {
          confirmButtonText: 'cancel',
          showConfirmButton: true,
          confirmButtonClass: '4444'
        }
      })
      expect(
        warpper.findAll('.el-button--primary')[1].element.classList
      ).toContain('4444')
      expect(warpper.findAll('.el-message-box__btns button')[1].text()).toEqual(
        'cancel'
      )
      expect(
        warpper.findAll('.el-message-box__btns button')[1].isVisible()
      ).toBeTruthy()
    })

    it('proprety callback', async () => {
      let object = ref(null)
      const warpper = mount(MessageBox, {
        attrs: {
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
