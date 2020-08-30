import Popconfirm from '../src/main.vue'
import { mount } from '@vue/test-utils'
import Button from '../../button/Button.vue'

it('popConfirm', () => {
  const Comp = {
    template: `<div>
          <Popconfirm
            ref="popover"
            title="content">
            <Button slot="reference">trigger</Button>
          </Popconfirm>
        </div>`
  }

  const wrapper = mount(Comp, {
    global: {
      components: {
        Popconfirm,
        Button
      }
    }
  })
  wrapper
    .findComponent({ name: 'ElPopconfirm' })
    .findComponent({ name: 'ElButton' })
    .trigger('click')
  expect(wrapper.querySelector('.el-popconfirm__action'.style.display)).toEqual(
    ''
  )
})
