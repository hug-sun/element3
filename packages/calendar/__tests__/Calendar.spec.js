import Calendar from '../Calendar.vue'
import { mount } from '@vue/test-utils'
describe('Calendar.vue', () => {
  describe('value', () => {
    const currentDate = () => {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      return `${year} 年 ${month} 月`
    }

    it('value is exactyly Date should be current month', () => {
      const wrapper = mount(Calendar, {
        props: {
          value: new Date()
        }
      })
      expect(wrapper.find('.el-calendar__title').text()).toBe(currentDate())
    })

    it('value is empty should be current month', () => {
      const wrapper = mount(Calendar, {
        props: {
          value: ''
        }
      })
      expect(wrapper.find('.el-calendar__title').text()).toBe(currentDate())
    })
  })

  describe('range', () => {
    it(' calendar is-range', () => {
      const wrapper = mount(Calendar, {
        props: {
          range: ['2019-03-04', '2019-03-24']
        }
      })
      expect(wrapper.find('.is-range').exists())
    })
  })
})
