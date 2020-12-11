/*
 * @Author: Mr Chang
 * @Date: 2020-08-31 11:36:07
 * @LastEditTime: 2020-09-18 17:18:28
 * @LastEditors: Mr Chang
 * @Description:
 * @FilePath: \element3\packages\steps\__tests__\steps.spec.js
 */
import Steps from '../src/steps.vue'
import Step from '../src/step.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('Steps.vue', () => {
  it('create', async () => {
    const wrapper = mount({
      template: `
      <el-steps :active="active" finish-status="success">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>

      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      `,
      components: {
        [Steps.name]: Steps,
        [Step.name]: Step
      },
      data() {
        return {
          active: 0
        }
      },
      methods: {
        next() {
          if (this.active++ > 2) this.active = 0
        }
      }
    })
    await nextTick()
    const stepsDom = wrapper.find('.el-steps')
    const stepDomList = wrapper.findAll('.el-step')

    expect(stepsDom.classes()).toContain('el-steps')

    expect(stepDomList.length).toBe(3)
  })

  // it('space', async () => {
  //   const wrapper1 = mount({
  //     template: `
  //     <el-steps>
  //       <el-step title="step1"></el-step>
  //       <el-step title="step2"></el-step>
  //       <el-step title="step3"></el-step>
  //     </el-steps>
  //     `,
  //     components: {
  //       [Steps.name]: Steps,
  //       [Step.name]: Step
  //     }
  //   })
  //   const wrapper2 = mount({
  //     template: `
  //     <el-steps :space="100">
  //       <el-step title="step1"></el-step>
  //       <el-step title="step2"></el-step>
  //       <el-step title="step3"></el-step>
  //       <el-step title="step4"></el-step>
  //     </el-steps>
  //     `,
  //     components: {
  //       [Steps.name]: Steps,
  //       [Step.name]: Step
  //     }
  //   })
  //   await nextTick()
  //   const step1 = wrapper1.find('.el-step')
  //   const step2 = wrapper2.find('.el-step')
  //   expect(step1.element.style.flexBasis).toBe('50%')
  //   expect(step2.element.style.flexBasis).toBe('100px')
  // })

  it('processStatus', async () => {
    const wrapper = mount({
      template: `
      <el-steps :active="1" process-status="error">
        <el-step title="step1"></el-step>
        <el-step title="step2"></el-step>
        <el-step title="step3"></el-step>
      </el-steps>`,
      components: {
        [Steps.name]: Steps,
        [Step.name]: Step
      }
    })
    await nextTick()
    const list = wrapper.findAll('.el-step__head.is-error')
    expect(list.length).toBe(1)
  })

  // it('update processStatus', async () => {
  //   const wrpper = mount({
  //     template: `
  //       <el-steps :active="1" :process-status="processStatus">
  //         <el-step title="abc"></el-step>
  //         <el-step title="abc2"></el-step>
  //       </el-steps>
  //     `,
  //     components: {
  //       [Steps.name]: Steps,
  //       [Step.name]: Step
  //     },
  //     data() {
  //       return { processStatus: 'error' }
  //     }
  //   })
  //   await nextTick()
  //   expect(wrpper.findAll('.el-step__head.is-error').length).toBe(1)
  //   wrpper.vm.processStatus = 'process'
  //   await nextTick()
  //   expect(wrpper.findAll('.el-step__head.is-process').length).toBe(1)
  // })

  it('finishStatus', async () => {
    const wrapper = mount({
      template: `
      <el-steps :active="1" finish-status="error">
        <el-step title="abc"></el-step>
        <el-step title="abc2"></el-step>
      </el-steps>`,
      components: {
        [Steps.name]: Steps,
        [Step.name]: Step
      }
    })
    await nextTick()
    expect(wrapper.findAll('.el-step__head.is-error').length).toBe(1)
  })

  // it('active', async () => {
  //   const wrapper = mount({
  //     template: `
  //       <el-steps :active="active" finish-status="error">
  //         <el-step title="abc"></el-step>
  //         <el-step title="abc2"></el-step>
  //       </el-steps>
  //     `,
  //     components: {
  //       [Steps.name]: Steps,
  //       [Step.name]: Step
  //     },
  //     data() {
  //       return { active: 0 }
  //     }
  //   })
  //   await nextTick()
  //   expect(wrapper.findAll('.el-step__head.is-error').length).toBe(0)
  //   wrapper.vm.active = 2
  //   await nextTick()
  //   expect(wrapper.findAll('.el-step__head.is-error').length).toBe(2)
  // })

  it('create vertical', async () => {
    const wrapper = mount({
      template: `
      <el-steps direction="vertical">
        <el-step title="aaa"></el-step>
        <el-step title="bbb"></el-step>
      </el-steps>
      `,
      components: {
        [Steps.name]: Steps,
        [Step.name]: Step
      }
    })
    await nextTick()
    expect(wrapper.find('.is-vertical')).toBeTruthy()
  })
  it('vertical:height', async () => {
    const wrapper = mount({
      template: `
      <el-steps direction="vertical" :space="200">
        <el-step title="aaa"></el-step>
        <el-step title="bbb"></el-step>
      </el-steps>
      `,
      components: {
        [Steps.name]: Steps,
        [Step.name]: Step
      }
    })
    await nextTick()
    expect(wrapper.find('.el-step').element.style.flexBasis).toBe('200px')
  })

  it('step:status=error', async () => {
    const wrapper = mount({
      template: `
      <el-steps :active="2" process-status="process" finish-status="success" direction="horizontal">
        <el-step title="step1"></el-step>
        <el-step title="step2" status="error"></el-step>
        <el-step title="step3"></el-step>
      </el-steps>
      `,
      components: {
        [Steps.name]: Steps,
        [Step.name]: Step
      }
    })
    await nextTick()
    const errorLine = wrapper.find('.el-step:nth-child(2) .el-step__line-inner')
    // errorLine.element.getBoundingClientRect = jest.fn(() => ({
    //   wtdth: 200
    // }))
    expect(errorLine.element.getBoundingClientRect().width).toBe(0)
    const nextStep = wrapper.find('.el-step:nth-child(3) .el-step__head')
    console.log(nextStep)
    expect(nextStep.classes()).toContain('is-wait')
  })
})
