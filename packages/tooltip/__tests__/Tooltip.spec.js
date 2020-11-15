import { mount } from '@vue/test-utils'
import { nextTick } from '@vue/runtime-core'
import Tooltip from '../Tooltip'

describe('Tooltip', () => {
  let wrapper
  it('create', (done) => {
    wrapper = mount({
      template: `
                <el-tooltip ref="tooltip" content="提示文字">
                    <button>click</button>
                </el-tooltip>
            `,
      components: {
        [Tooltip.name]: Tooltip
      }
    })
    nextTick(() => {
      expect(wrapper.vm.$refs.tooltip.popperVM.$el).toHaveProperty(
        'textContent',
        '提示文字'
      )
      done()
    })
  })

  it('custom popper class', (done) => {
    wrapper = mount({
      template: `
                <el-tooltip ref="tooltip" content="提示文字" popper-class="custom-popper">
                    <button>click</button>
                </el-tooltip>
            `,
      components: {
        [Tooltip.name]: Tooltip
      }
    })
    nextTick(() => {
      expect(
        wrapper.vm.$refs.tooltip.popperVM.$el.classList.contains(
          'custom-popper'
        )
      ).toBeTruthy()
      done()
    })
  })

  describe('manual', () => {
    const wrapper = mount({
      template: `
            <el-tooltip ref="tooltip" manual content="abc" v-model="show">
                <button>click</button>
            </el-tooltip>
            `,
      data() {
        return { show: false }
      },
      components: {
        [Tooltip.name]: Tooltip
      }
    })
    const tooltip = wrapper.vm.$refs.tooltip
    const tooltip2 = wrapper.findComponent({ name: 'ElTooltip' })

    it('aria-hidden is true', async (done) => {
      await tooltip2.trigger('mouseenter')
      expect(tooltip.popperVM.$el.getAttribute('aria-hidden')).toBe('true')
      setTimeout(() => {
        expect(tooltip.popperVM.$el.getAttribute('aria-hidden')).toBe('true')
        done()
      }, 0)
    })
    it('show', (done) => {
      wrapper.vm.show = true
      nextTick(() => {
        expect(tooltip.popperVM.$el.getAttribute('aria-hidden')).toBe('false')
        done()
      })
    })
    it('still show when trigger mouseleave', async (done) => {
      await tooltip2.trigger('mouseleave')
      expect(tooltip.popperVM.$el.getAttribute('aria-hidden')).toBe('false')
      setTimeout(() => {
        expect(tooltip.popperVM.$el.getAttribute('aria-hidden')).toBe('false')
        done()
      }, 0)
    })
    it('hidden', (done) => {
      wrapper.vm.show = false
      nextTick(() => {
        expect(tooltip.popperVM.$el.getAttribute('aria-hidden')).toBe('true')
        done()
      })
    })
  })

  describe('hover', () => {
    const wrapper = mount({
      template: `
                <el-tooltip ref="tooltip" content="提示文字">
                    <button>click</button>
                </el-tooltip>
            `,
      components: {
        [Tooltip.name]: Tooltip
      }
    })
    const tooltip = wrapper.vm.$refs.tooltip
    const tooltip2 = wrapper.getComponent({ name: 'ElTooltip' })
    tooltip2.trigger('mouseenter')

    it('popperElm is exist', (done) => {
      nextTick(() => {
        expect(tooltip.$refs.popper).toBeTruthy()
        done()
      })
    })
    it('aria-hidden is false', (done) => {
      nextTick(() => {
        expect(tooltip.popperVM.$el.getAttribute('aria-hidden')).toBe('false')
        done()
      })
    })
    it('close popper', (done) => {
      tooltip2.trigger('mouseleave')
      setTimeout(() => {
        expect(tooltip.popperVM.$el.getAttribute('aria-hidden')).toBe('true')
        done()
      }, 300)
    })
  })

  it('light mode', (done) => {
    wrapper = mount({
      template: `
                <el-tooltip ref="tooltip" content="abc" effect="light">
                    <button>abc</button>
                </el-tooltip>
            `,
      components: {
        [Tooltip.name]: Tooltip
      }
    })
    nextTick(() => {
      expect(
        wrapper.vm.$refs.tooltip.popperVM.$el.classList.contains('is-light')
      ).toBeTruthy()
      done()
    })
  })
  it('hide after', (done) => {
    wrapper = mount({
      template: `
                <el-tooltip ref="tooltip" content="提示文字" :hide-after="300">
                    <button>click</button>
                </el-tooltip>
            `,
      components: {
        [Tooltip.name]: Tooltip
      }
    })
    const tooltip = wrapper.vm.$refs.tooltip
    const tooltip2 = wrapper.getComponent({ name: 'ElTooltip' })

    nextTick(() => {
      tooltip2.trigger('mouseenter')
      setTimeout(() => {
        expect(tooltip.popperVM.$el.getAttribute('aria-hidden')).toBe('false')
        setTimeout(() => {
          expect(tooltip.popperVM.$el.getAttribute('aria-hidden')).toBe('true')
          done()
        }, 300)
      }, 100)
    })
  })
  it('reference element focus', (done) => {
    wrapper = mount({
      template: `
                <el-tooltip ref="tooltip" content="提示文字">
                    <button>click</button>
                </el-tooltip>
            `,
      components: {
        [Tooltip.name]: Tooltip
      }
    })

    const tooltip = wrapper.vm.$refs.tooltip
    const tooltip2 = wrapper.getComponent({ name: 'ElTooltip' })
    nextTick(() => {
      tooltip2.trigger('focus')
      setTimeout(() => {
        expect(tooltip.popperVM.$el.getAttribute('aria-hidden')).toBe('false')
        expect(
          wrapper.find('button').element.classList.contains('focusing')
        ).toBeTruthy()
        tooltip2.trigger('blur')
        setTimeout(() => {
          expect(tooltip.popperVM.$el.getAttribute('aria-hidden')).toBe('true')
          expect(
            wrapper.find('button').element.classList.contains('focusing')
          ).toBeFalsy()
          done()
        }, 300)
      }, 100)
    })
  })
  it('custom tabindex', () => {
    wrapper = mount({
      template: `
                <el-tooltip ref="tooltip" content="提示文字" :tabindex="-1">
                    <button>click</button>
                </el-tooltip>
            `,
      components: {
        [Tooltip.name]: Tooltip
      }
    })
    expect(wrapper.find('button').element.getAttribute('tabindex')).toBe('-1')
  })
})
