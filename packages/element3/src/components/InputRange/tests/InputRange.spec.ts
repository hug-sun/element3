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
})
