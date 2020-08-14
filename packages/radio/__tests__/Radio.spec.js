import Radio from '../Radio'
import { mount } from '@vue/test-utils'

describe('Radio.vue', () => {
  describe('props', () => {
    it('modelValue/vModel', async() => {
      const wrapper = mount({
        template: `
                  <el-radio id="r1" v-model="value" label="1"></el-radio>
                  <el-radio id="r2" v-model="value" label="2"></el-radio>`,
        components: { elRadio: Radio },
        data() {
          return {
            value: ''
          }
        }
      })

      wrapper.find('#r1').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.value).toBe('1')

      wrapper.find('#r2').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.value).toBe('2')
    })

    it('label', () => {
      const wrapper = mount(Radio, {
        props: {
          label: '1'
        }
      })
      const radioWrapper = wrapper.find('input[type=radio]')

      expect(radioWrapper.attributes('value')).toBe('1')
    })

    it('disabled', () => {
      const wrapper = mount(Radio, {
        props: {
          disabled: true
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
    })

    it('border', () => {
      const wrapper = mount(Radio, {
        props: {
          border: true
        }
      })

      expect(wrapper.classes()).toContain('is-bordered')
    })

    it('size', async() => {
      const wrapper = mount(Radio, {
        props: {
          border: true, // border must be true
          size: ''
        }
      })

      await wrapper.setProps({ size: 'medium' })
      expect(wrapper.classes()).toContain('el-radio--medium')

      await wrapper.setProps({ size: 'small' })
      expect(wrapper.classes()).toContain('el-radio--small')

      await wrapper.setProps({ size: 'mini' })
      expect(wrapper.classes()).toContain('el-radio--mini')
    })

    it('name', () => {
      const wrapper = mount(Radio, {
        props: {
          name: 'radio1'
        }
      })
      const radioWrapper = wrapper.find('input[type=radio]')

      expect(radioWrapper.attributes('name')).toBe('radio1')
    })
  })

  describe('event', ()=>{
    it('change', async()=>{

      const wrapper = mount({
        template: `
                  <el-radio id="r1" v-model="value" label="1" @change="current=$event"></el-radio>
                  <el-radio id="r2" v-model="value" label="2" @change="current=$event"></el-radio>`,
        components: { elRadio: Radio },
        data() {
          return {
            current: '',
            value: ''
          }
        }
      })

      wrapper.find('#r1').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.current).toBe('1')

      wrapper.find('#r2').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.current).toBe('2')
    })
  })
})
