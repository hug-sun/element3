import { render, screen } from '@testing-library/vue'
import { flushPromises, mount } from '@vue/test-utils'
import Step from '../src/Step'
import Steps from '../src/Steps'
import { renderSteps } from './Steps.stories'

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
    const Comps = {
      template: `
            <Steps :active='1'>
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

  // test('should click 2nd step and show me the success, process and wait status', () => {
  //   render(renderSteps())

  //   userEvent.click(screen.getByText(/步骤2/i))

  //   screen.debug()

  //   expect(screen.getByText(/步骤1/i)).toHaveClass('el-success')
  //   expect(screen.getByText(/步骤2/i)).toHaveClass('el-process')
  //   expect(screen.getByText(/步骤3/i)).toHaveStyle('el-wait')
  // })
})
