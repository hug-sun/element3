import { render } from '@testing-library/vue'
import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'
import Step from '../src/Step'
import Steps from '../src/Steps'

// todo
// test('should click 2nd step and show me the success, process and wait status', () => {
//   const Comp = {
//     template: `
//     <el-steps :active="1">
//       <el-step title="步骤1"></el-step>
//       <el-step title="步骤2"></el-step>
//       <el-step title="步骤3"></el-step>
//     </el-steps>
//     `,
//     components: {
//       'el-steps': Steps,
//       'el-step': Step
//     }
//   }

//   render(Comp)
//   userEvent.click(screen.getByText(/步骤2/i))

//   expect(screen.getByText(/步骤1/i)).toHaveClass('el-success')
//   expect(screen.getByText(/步骤2/i)).toHaveClass('el-process')
//   expect(screen.getByText(/步骤3/i)).toHaveStyle('el-wait')
// })

describe('Steps', () => {
  test('should have three step elements', () => {
    // given
    const Comps = {
      template: `
        <Steps>
        <Step></Step>
        <Step></Step>
        <Step></Step>
        </Steps>
      `,
      components: {
        Steps,
        Step
      }
    }

    // when
    const { container } = render(Comps)
    const stepList = container.querySelectorAll('.el-step')

    // then
    expect(stepList).toHaveLength(3)
  })

  test('should first step is process && second and third are wait  ', async () => {
    // given
    const Comps = {
      template: `
        <Steps>
        <Step></Step>
        <Step></Step>
        <Step></Step>
        </Steps>
      `,
      components: {
        Steps,
        Step
      }
    }

    // when
    const wrapper = mount(Comps, {})
    await flushPromises()

    const stepList = wrapper.findAllComponents(Step)

    // then
    expect(stepList[0].find('.is-process')).toBeExist()
    expect(stepList[1].find('.is-wait')).toBeExist()
    expect(stepList[2].find('.is-wait')).toBeExist()
  })
  test('should active step is process && front are success and remains are wait', async () => {
    // given

    const active = ref(1)
    const Comps = {
      template: `
        <Steps :active="active">
          <Step></Step>
          <Step></Step>
          <Step></Step>
        </Steps>
      `,
      components: {
        Steps,
        Step
      },
      setup() {
        return {
          active
        }
      }
    }

    // when
    const wrapper = mount(Comps, {})
    await flushPromises()

    const stepList = wrapper.findAll('.el-step')

    // then
    expect(stepList[0].find('.is-finish')).toBeExist()
    expect(stepList[1].find('.is-process')).toBeExist()
    expect(stepList[2].find('.is-wait')).toBeExist()

    // update
    active.value = 2
    await flushPromises()

    const newStepList = wrapper.findAll('.el-step')

    expect(newStepList[0].find('.is-finish')).toBeExist()
    expect(newStepList[1].find('.is-finish')).toBeExist()
    expect(newStepList[2].find('.is-process')).toBeExist()
  })

  test('如果指定finish-status为success，第一个元素的状态为is-success', async () => {
    // given
    const Comps = {
      template: `
        <Steps :active="1" finish-status="success">
        <Step></Step>
        <Step></Step>
        <Step></Step>
        </Steps>
      `,
      components: {
        Steps,
        Step
      }
    }

    // when
    const wrapper = mount(Comps, {})
    await flushPromises()

    const stepList = wrapper.findAllComponents(Step)

    // then
    expect(stepList[0].find('.is-success')).toBeExist()
    expect(stepList[1].find('.is-process')).toBeExist()
    expect(stepList[2].find('.is-wait')).toBeExist()
  })

  test('如果指定process-status为 error ，第二个元素的状态为is-error', async () => {
    // given
    const Comps = {
      template: `
        <Steps :active="1" finish-status="success" process-status="error">
        <Step></Step>
        <Step></Step>
        <Step></Step>
        </Steps>
      `,
      components: {
        Steps,
        Step
      }
    }

    // when
    const wrapper = mount(Comps, {})
    await flushPromises()

    const stepList = wrapper.findAllComponents(Step)

    // then
    expect(stepList[0].find('.is-success')).toBeExist()
    expect(stepList[1].find('.is-error')).toBeExist()
    expect(stepList[2].find('.is-wait')).toBeExist()
  })
})
