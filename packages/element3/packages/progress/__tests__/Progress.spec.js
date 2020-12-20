import Progress from '../Progress.vue'
import { mount } from '@vue/test-utils'

describe('Progress.vue', () => {
  describe('props', () => {
    it('percentage', () => {
      const wrapper = mount(Progress, {
        props: {
          percentage: 50
        }
      })
      expect(wrapper.find('.el-progress__text').text()).toContain('50%')
      expect(
        wrapper.find('.el-progress-bar__inner').attributes().style
      ).toContain('50%')
    })

    it('type', () => {
      const wrapperLine = mount(Progress, {
        props: {
          type: 'line'
        }
      })
      const wrapperCircle = mount(Progress, {
        props: {
          type: 'circle'
        }
      })
      const wrapperDashboard = mount(Progress, {
        props: {
          type: 'dashboard'
        }
      })
      expect(wrapperLine.classes()).toContain('el-progress--line')
      expect(wrapperCircle.classes()).toContain('el-progress--circle')
      expect(wrapperDashboard.classes()).toContain('el-progress--dashboard')
    })

    it('strokeWidth', () => {
      const wrapper = mount(Progress, {
        props: {
          strokeWidth: 10
        }
      })
      expect(
        wrapper.find('.el-progress-bar__outer').attributes().style
      ).toContain('10px')
    })

    it('textInside', () => {
      const wrapper = mount(Progress, {
        props: {
          textInside: true
        }
      })
      expect(wrapper.classes()).toContain('el-progress--text-inside')
    })

    it('status', () => {
      const wrapperSuccess = mount(Progress, {
        props: {
          status: 'success'
        }
      })
      const wrapperException = mount(Progress, {
        props: {
          status: 'exception'
        }
      })
      const wrapperWarning = mount(Progress, {
        props: {
          status: 'warning'
        }
      })
      expect(wrapperSuccess.classes()).toContain('is-success')
      expect(wrapperException.classes()).toContain('is-exception')
      expect(wrapperWarning.classes()).toContain('is-warning')
    })

    it('color', async () => {
      const wrapperString = mount(Progress, {
        props: {
          color: 'rgb(0, 0, 0)'
        }
      })
      const wrapperFunction = mount(Progress, {
        props: {
          color: () => {
            return '#13ce66'
          }
        }
      })
      const wrapperArray = mount(Progress, {
        props: {
          percentage: 50,
          color: [
            { color: '#f56c6c', percentage: 20 },
            { color: '#e6a23c', percentage: 40 },
            { color: '#20a0ff', percentage: 60 },
            { color: '#13ce66', percentage: 80 },
            { color: '#6f7ad3', percentage: 100 }
          ]
        }
      })

      expect(
        wrapperString.find('.el-progress-bar__inner').attributes().style
      ).toContain('rgb(0, 0, 0)')
      expect(
        wrapperFunction.find('.el-progress-bar__inner').attributes().style
      ).toContain('rgb(19, 206, 102)')

      expect(
        wrapperArray.find('.el-progress-bar__inner').attributes().style
      ).toContain('rgb(32, 160, 255)')
      await wrapperArray.setProps({
        percentage: 70
      })

      expect(
        wrapperArray.find('.el-progress-bar__inner').attributes().style
      ).toContain('rgb(19, 206, 102)')
    })

    it('width', () => {
      const wrapper = mount(Progress, {
        props: {
          type: 'circle',
          width: 100
        }
      })
      expect(wrapper.find('.el-progress-circle').attributes().style).toContain(
        '100px'
      )
    })

    it('showText', () => {
      const wrapper = mount(Progress, {
        props: {
          showText: false
        }
      })
      expect(wrapper.classes()).toContain('el-progress--without-text')
    })

    it('format content', () => {
      const wrapper = mount(Progress, {
        props: {
          format: () => {
            return `占比${50}%`
          }
        }
      })
      expect(wrapper.find('.el-progress__text').text()).toContain('占比50%')
    })
  })
})
