import Popconfirm from '../src/main.vue'
import { mount } from '@vue/test-utils'
import Button from '../../button/Button'

describe('popConfirm.vue', () => {
  it('popConfirm', () => {
    const Comp = {
      template: `<div>
          <el-popconfirm
            ref="popover"
            title="content">
            <el-button slot="reference">trigger</el-button>
          </el-popconfirm>
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
    expect(
      wrapper.querySelector('.el-popconfirm__action'.style.display).to.equal('')
    )
  })
})
