import { mount } from '@vue/test-utils'
import { TreeNode } from '../src/entity/TreeNode'
import ElTreeNode from '../src/TreeNode.vue'

describe('TreeNode.vue', () => {
  it('render a tree', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(11, 'Node1-1'),
      new TreeNode(12, 'Node1-2')
    ])

    const wrapper = mount(ElTreeNode, {
      props: {
        node: treeNode
      },
      global: {
        provide: {
          elTree: {
            $slots: {}
          }
        }
      }
    })
    expect(wrapper.find('#TreeNode1').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode11').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode12').exists()).toBeTruthy()
  })
})
