import { mount } from '@vue/test-utils'
import Slider from '../index'
import SliderButton from '../src/button.vue'
import ElInputNumber from 'element-ui/packages/input-number'
import ElTooltip from 'element-ui/packages/tooltip'
import { ref } from '@vue/reactivity'
import { nextTick } from '@vue/runtime-core'

const runWayCls = '.el-slider__runway'
// https://github.com/jsdom/jsdom/issues/1590#issuecomment-578350151
function mockSliderRunWayGetBoundingClientRect(wrapper, rect = null) {
  const runWayElement = wrapper.find(runWayCls).element
  runWayElement.getBoundingClientRect = jest.fn(() =>
    Object.assign(
      {
        x: 8,
        y: 570,
        width: 754,
        height: 6,
        top: 570,
        right: 762,
        bottom: 576,
        left: 8
      },
      rect || {}
    )
  )
}
function mockSliderRunWayClientAttr(wrapper, val = 754) {
  const runWayElement = wrapper.find(runWayCls).element
  // main resetSize
  const key = `client${wrapper.vm.vertical ? 'Height' : 'Width'}`
  Object.defineProperty(runWayElement, key, {
    get() {
      return val
    }
  })
}

describe('Slider', () => {
  it('create', () => {
    const wrapper = mount(Slider)
    mockSliderRunWayClientAttr(wrapper)
    expect(wrapper.vm.modelValue).toEqual(0)
  })

  it('should not exceed min and max', (done) => {
    const silider = ref(0)
    const wrapper = mount(Slider, {
      props: {
        modelValue: silider,
        min: 50,
        'onUpdate:modelValue': (val) => {
          silider.value = val
        }
      }
    })
    mockSliderRunWayClientAttr(wrapper)
    silider.value = 40
    nextTick(() => {
      expect(silider.value).toEqual(50)
      silider.value = 120
      nextTick(() => {
        expect(silider.value).toEqual(100)
        done()
      })
    })
  })

  it('show tooltip', (done) => {
    const silider = ref(0)
    const wrapper = mount(Slider, {
      props: {
        modelValue: silider,
        'onUpdate:modelValue': (val) => {
          silider.value = val
        }
      }
    })
    mockSliderRunWayClientAttr(wrapper)
    const sliderBtn = wrapper.findComponent(SliderButton)
    const toolTip = wrapper.findComponent(ElTooltip)
    sliderBtn.trigger('mouseenter')
    nextTick(async () => {
      expect(toolTip.vm.showPopper).toBeTruthy()
      await sliderBtn.trigger('mouseleave')
      expect(toolTip.vm.showPopper).toBeFalsy()
      done()
    })
  })

  it('hide tooltip', () => {
    const silider = ref(0)
    const wrapper = mount(Slider, {
      props: {
        modelValue: silider,
        showTooltip: false,
        'onUpdate:modelValue': (val) => {
          silider.value = val
        }
      }
    })
    const toolTip = wrapper.findComponent(ElTooltip)
    expect(toolTip.vm.disabled).toBeTruthy()
  })

  it('format tooltip', (done) => {
    const silider = ref(0)
    const wrapper = mount(Slider, {
      props: {
        modelValue: silider,
        formatTooltip(val) {
          return '$' + val
        }
      }
    })
    const sliderBtn = wrapper.findComponent(SliderButton)
    nextTick(() => {
      expect(sliderBtn.vm.formatValue).toEqual('$0')
      done()
    })
  })

  it('accessibility', (done) => {
    const slider = ref(0.1)
    const wrapper = mount(Slider, {
      props: {
        modelValue: slider,
        'onUpdate:modelValue': (val) => {
          slider.value = val
        }
      }
    })
    const sliderBtn = wrapper.findComponent(SliderButton)
    sliderBtn.vm.onRightKeyDown()
    nextTick(() => {
      expect(slider.value).toEqual(1)
      sliderBtn.vm.onLeftKeyDown()
      nextTick(() => {
        expect(slider.value).toEqual(0)
        done()
      })
    })
  })

  it('step', (done) => {
    const slider = ref(0)
    const wrapper = mount(Slider, {
      props: {
        modelValue: slider,
        max: 1,
        min: 0,
        step: 0.1,
        'onUpdate:modelValue': (val) => {
          slider.value = val
        }
      }
    })
    mockSliderRunWayClientAttr(wrapper, 200)
    mockSliderRunWayGetBoundingClientRect(wrapper)
    const sliderBtn = wrapper.findComponent(SliderButton)
    const btnVm = sliderBtn.vm
    btnVm.onButtonDown({ clientX: 0, preventDefault() {} })
    btnVm.onDragging({ clientX: 100 })
    btnVm.onDragEnd()
    nextTick(() => {
      const val = slider.value
      console.log('val ------:>> ', val)
      expect(val > 0.4 && val < 0.6).toBeTruthy()
      done()
    })
  })

  it('click', (done) => {
    const slider = ref(0)
    const wrapper = mount(Slider, {
      props: {
        modelValue: slider,
        'onUpdate:modelValue': (val) => {
          slider.value = val
        }
      }
    })
    wrapper.find(runWayCls).trigger('click', { clientX: 100 })
    nextTick(() => {
      expect(slider.value > 0).toBeTruthy()
      done()
    })
  })

  it('change event', (done) => {
    const slider = ref(0)
    const wrapper = mount(Slider, {
      props: {
        modelValue: slider,
        'onUpdate:modelValue': (val) => {
          slider.value = val
        },
        onChange(val) {
          slider.value = val
        }
      }
    })
    mockSliderRunWayClientAttr(wrapper)
    mockSliderRunWayGetBoundingClientRect(wrapper)
    const runWayWrapper = wrapper.find(runWayCls)
    runWayWrapper.trigger('click', { clientX: 100 })
    nextTick(() => {
      expect(slider.value > 0).toBeTruthy()
      done()
    })
  })

  it('disabled', (done) => {
    const slider = ref(0)
    const wrapper = mount(Slider, {
      props: {
        modelValue: slider,
        disabled: true,
        'onUpdate:modelValue': (val) => {
          slider.value = val
        }
      }
    })
    const sliderBtn = wrapper.findComponent(SliderButton)
    sliderBtn.trigger('mousedown', { clientX: 0, preventDefault() {} })
    sliderBtn.vm.onDragging({ clientX: 100 })
    sliderBtn.vm.onDragEnd()
    nextTick(() => {
      expect(slider.value).toEqual(0)
      done()
    })
  })

  it('show input', async () => {
    const slider = ref(0)
    const wrapper = mount(Slider, {
      props: {
        modelValue: slider,
        showInput: true,
        'onUpdate:modelValue': (val) => {
          slider.value = val
        }
      }
    })
    const inputNumber = wrapper.findComponent(ElInputNumber)
    await inputNumber.vm.setCurrentValue(40)
    expect(slider.value).toEqual(40)
    await inputNumber.vm.increase()
    expect(slider.value).toEqual(41)
    await inputNumber.vm.decrease()
    expect(slider.value).toEqual(40)
  })

  it('show stops', () => {
    const wrapper = mount(Slider, {
      props: {
        step: 10,
        showStops: true
      }
    })
    const stops = wrapper.findAll('.el-slider__stop')
    expect(stops.length).toEqual(9)
  })

  it('vertical mode', (done) => {
    const slider = ref(0)
    const wrapper = mount(Slider, {
      props: {
        modelValue: slider,
        vertical: true,
        height: '200px',
        'onUpdate:modelValue': (val) => {
          console.log('vertical mode', val)
          slider.value = val
        }
      }
    })
    mockSliderRunWayClientAttr(wrapper, 200)
    mockSliderRunWayGetBoundingClientRect(wrapper)
    const runWayWrapper = wrapper.find(runWayCls)
    runWayWrapper.trigger('click', { clientY: 100 })
    nextTick(() => {
      expect(slider.value > 0).toBe(true)
      done()
    })
  })

  describe('range', () => {
    it('basic ranged slider', () => {
      const wrapper = mount(Slider, {
        props: {
          modelValue: [10, 20],
          range: true
        }
      })
      const btns = wrapper.findAll('.el-slider__button-wrapper')
      expect(btns.length).toEqual(2)
    })

    it('should not exceed min and max', async (done) => {
      var slider = [50, 60]
      const wrapper = mount(Slider, {
        props: {
          modelValue: slider,
          range: true,
          min: 50,
          'onUpdate:modelValue': (val) => {
            slider = val
          }
        }
      })
      wrapper.setProps({ modelValue: [40, 60] })
      nextTick(async () => {
        expect(slider).toEqual([50, 60])
        await wrapper.setProps({ modelValue: [50, 160] })
        nextTick(() => {
          expect(slider).toEqual([50, 100])
          done()
        })
      })
    })

    it('click', () => {
      var slider = [0, 100]
      const wrapper = mount(Slider, {
        props: {
          modelValue: slider,
          range: true,
          'onUpdate:modelValue': (val) => {
            slider = val
          }
        }
      })
      mockSliderRunWayClientAttr(wrapper, 200)
      mockSliderRunWayGetBoundingClientRect(wrapper)
      const runWayWrapper = wrapper.find(runWayCls)
      runWayWrapper.trigger('click', { clientX: 100 })
      nextTick(async () => {
        expect(slider.value[0] > 0).toBeTruthy()
        expect(slider.value[1]).toEqual(100)
      })
    })

    it('responsive to dynamic min and max', () => {
      var slider = [50, 80]
      const min = ref(0)
      const max = ref(100)
      const wrapper = mount(Slider, {
        props: {
          modelValue: slider,
          min,
          max,
          range: true,
          'onUpdate:modelValue': (val) => {
            slider = val
          }
        }
      })
      mockSliderRunWayClientAttr(wrapper)
      min.value = 60
      nextTick(() => {
        expect(slider).toEqual([60, 80])
        wrapper.setProps({ modelValue: [60, 80] })
        min.value = 30
        max.value = 40
        nextTick(() => {
          expect(slider).toEqual([40, 40])
        })
      })
    })

    it('show stops', (done) => {
      var slider = [30, 60]
      const wrapper = mount(Slider, {
        props: {
          modelValue: slider,
          range: true,
          step: 10,
          showStops: true,
          'onUpdate:modelValue': (val) => {
            slider = val
          }
        }
      })
      mockSliderRunWayClientAttr(wrapper)
      nextTick(() => {
        const stops = wrapper.findAll('.el-slider__stop')
        expect(stops.length).toEqual(5)
        done()
      })
    })

    it('marks', (done) => {
      var slider = [30, 60]
      const wrapper = mount(Slider, {
        props: {
          modelValue: slider,
          range: true,
          step: 10,
          marks: {
            0: '0°C',
            8: '8°C',
            37: '37°C',
            50: {
              style: {
                color: '#f50'
              },
              label: <strong>50°C</strong>
            }
          },
          min: 20,
          showStops: true,
          'onUpdate:modelValue': (val) => {
            slider = val
          }
        }
      })
      nextTick(() => {
        const stops = wrapper.findAll('.el-slider__marks-stop.el-slider__stop')
        const marks = wrapper.findAll(
          '.el-slider__marks .el-slider__marks-text'
        )
        expect(stops.length).toEqual(2)
        expect(marks.length).toEqual(2)
        done()
      })
    })
  })
})
