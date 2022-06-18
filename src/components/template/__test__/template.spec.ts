import { describe, it } from 'vitest'
// import { render, waitFor } from '@testing-library/vue'

describe('测试模板', () => {
  it('vitest基本用法', () => {
    expect(1 + 2).toBe(3)
    expect({ name: 'xxx' }).toEqual({ name: 'xxx' })
  })
  // 组件渲染
  // it('button type', () => {
  //   const Comp = {
  //     template: '<Button type="primary"></Button>',
  //     components: {
  //       Button,
  //     },
  //   }

  //   const { getByRole } = render(Comp)
  //   expect(getByRole('button')).toHaveClass('el-button--primary')
  // })
})
