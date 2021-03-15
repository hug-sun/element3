// 1. 基于`modelValue`进行数据双向绑定，实现两个文本框的输入
// modelValue 是一个数组[start, end]
import { render, fireEvent } from '@testing-library/vue'
import InputRange from '../src/InputRange.vue'

describe('InputRange.vue', () => {
  it('set modelValue', async () => {
    const values = ['18:30:00', '20:30:00']
    const { getAllByRole } = render(InputRange, {
      props: {
        modelValue: values
      }
    })
    const inputs = getAllByRole('textbox') as HTMLInputElement[]
    expect(inputs[0].value).toBe(values[0])
    expect(inputs[1].value).toBe(values[1])

    await fireEvent.update(inputs[0], '19:30:00')
    expect(inputs[0]).toHaveValue('19:30:00')

    await fireEvent.update(inputs[1], '21:30:00')
    expect(inputs[1]).toHaveValue('21:30:00')
  })

  it('should get focus', async () => {
    const temp = {
      template: '<InputRange @focus="handleFocus"></InputRange>',
      components: {
        InputRange
      },
      methods: {
        handleFocus() {
          console.log('trigger focus event')
        }
      }
    }
    const { getAllByRole } = render(temp)
    const inputs = getAllByRole('textbox')
    await fireEvent.focus(inputs[0])
    expect(inputs[0]).toHaveProperty('focus')
  })

  it('should be readonly', () => {
    const { getAllByRole } = render(InputRange, {
      props: {
        readonly: true
      }
    })
    const inputs = getAllByRole('textbox')
    expect(inputs[0]).toHaveAttribute('readonly')
    expect(inputs[1]).toHaveAttribute('readonly')
  })

  it('should be disabled', () => {
    const { getAllByRole } = render(InputRange, {
      props: {
        disabled: true
      }
    })
    const inputs = getAllByRole('textbox')
    expect(inputs[0]).toHaveAttribute('disabled')
    expect(inputs[1]).toHaveAttribute('disabled')
  })
})
