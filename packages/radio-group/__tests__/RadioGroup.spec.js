import Radio from '../../radio/Radio'
import RadioGroup from '../RadioGroup'
import RadioButton from '../../radio-button/RadioButton'
import { mount } from '@vue/test-utils'

describe('RadioGroup.vue', () => {
  describe('RadioGroup.vue and Radio.vue', () => {
    const wrapper = mount({
      template: `
            <el-radio-group id="group" v-model="value" :size="size" :disabled="disabled" @change="current=$event">
              <el-radio id="r1" label="1" border></el-radio>
              <el-radio id="r2" label="2" border></el-radio>
              <el-radio id="r3" label="3" border></el-radio>
            </el-radio-group>`,
      components: { elRadio: Radio, elRadioGroup: RadioGroup },
      data() {
        return {
          value: '',
          size: '',
          disabled: false,
          current: ''
        }
      }
    })
    describe('props', () => {
      it('modelValue/vModel', async() => {
        wrapper.find('#r1').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.value).toBe('1')

        wrapper.find('#r2').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.value).toBe('2')

        wrapper.find('#r3').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.value).toBe('3')
      })

      it('size', async() => {
        wrapper.vm.size = 'medium'
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#r1').classes()).toContain('el-radio--medium')

        wrapper.vm.size = 'small'
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#r1').classes()).toContain('el-radio--small')

        wrapper.vm.size = 'mini'
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#r1').classes()).toContain('el-radio--mini')
      })

      it('disabled', async() => {
        wrapper.vm.disabled = true
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#r1').classes()).toContain('is-disabled')

        wrapper.vm.disabled = false
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#r1').classes()).not.toContain('is-disabled')
      })
    })

    describe('event', () => {
      it('change', async() => {

        wrapper.find('#r1').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.current).toBe('1')

        wrapper.find('#r2').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.current).toBe('2')

        wrapper.find('#r3').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.current).toBe('3')
      })
    })
  })

  describe('RadioGroup.vue and RadioButton.vue', () => {
    const wrapper = mount({
      template: `
            <el-radio-group id="group" v-model="value" :size="size" :disabled="disabled" @change="current=$event" :text-color="textColor" :fill="fill">
              <el-radio-button id="r1" label="1"></el-radio-button>
              <el-radio-button id="r2" label="2"></el-radio-button>
              <el-radio-button id="r3" label="3"></el-radio-button>
            </el-radio-group>`,
      components: { elRadioButton: RadioButton, elRadioGroup: RadioGroup },
      data() {
        return {
          value: '1',
          textColor: '',
          fill: '',
          size: '',
          disabled: false,
          current: ''
        }
      }
    })
    describe('props', () => {
      it('modelValue/vModel', async() => {
        wrapper.find('#r1').trigger('click')
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.value).toBe('1')

        wrapper.find('#r2').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.value).toBe('2')

        wrapper.find('#r3').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.value).toBe('3')
      })

      it('size', async() => {
        wrapper.vm.size = 'medium'
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#r1').classes()).toContain('el-radio-button--medium')

        wrapper.vm.size = 'small'
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#r1').classes()).toContain('el-radio-button--small')

        wrapper.vm.size = 'mini'
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#r1').classes()).toContain('el-radio-button--mini')
      })

      it('disabled', async() => {
        wrapper.vm.disabled = true
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#r1').classes()).toContain('is-disabled')

        wrapper.vm.disabled = false
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#r1').classes()).not.toContain('is-disabled')
      })

      it('text-color', async() => {
        wrapper.vm.textColor = 'blue'
        await wrapper.vm.$nextTick()
        expect(wrapper.findComponent(RadioGroup).vm.textColor).toBe('blue')
      })

      it('fill', async() => {
        wrapper.vm.fill = 'red'
        await wrapper.vm.$nextTick()
        expect(wrapper.findComponent(RadioGroup).vm.fill).toBe('red')
      })
    })

    describe('event', () => {
      it('change', async() => {

        wrapper.find('#r1').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.current).toBe('1')

        wrapper.find('#r2').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.current).toBe('2')

        wrapper.find('#r3').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.current).toBe('3')
      })
    })
  })
})
