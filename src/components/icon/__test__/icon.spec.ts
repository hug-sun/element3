import { describe, it } from 'vitest'
import { render } from '@testing-library/vue'
import Icon from '../Icon.vue'
describe('icon', () => {
  // 组件渲染
  it('icon name', () => {
    const Comp = {
      template: '<Icon name="edit"></Icon>',
      components: {
        Icon,
      },
    }

    const wrapper = render(Comp)
    expect(wrapper.container.querySelector('i')).toHaveClass('el-icon-edit')
  })
})
