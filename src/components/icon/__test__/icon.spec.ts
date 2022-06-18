import { describe, it } from 'vitest'
import { render } from '@testing-library/vue'
import Icon from '../Icon.vue'
describe('icon', () => {
  // 组件渲染
  it.skip('icon name', () => {
    const Comp = {
      template: '<Icon name="edit"></Icon>',
      components: {
        Icon,
      },
    }

    const { getByRole } = render(Comp)
    // console.log(getByRole('i'))
    expect(getByRole('i')).toHaveClass('el-icon--primary')
  })
})
