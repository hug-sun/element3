import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MessageBox from '../src/MessageBox.vue'
describe('MessageBox.vue', () => {
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
      console.log()
      expect(warpper.componentVM.getMessage.message).toBe('333')
    })
  })
  describe('test modal', () => {
    it('open modal', async () => {
      const warpper = mount(MessageBox, {
        props: {
          modal: true
        }
      })
      await nextTick()
      expect(warpper.find('.v-modal').exists()).toBeTruthy()
    })
  })
})
