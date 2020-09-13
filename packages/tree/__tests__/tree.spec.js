import { mount } from '@vue/test-utils'
import Tree from '../Tree.vue'

function createData() {
  const data = [
    {
      id: 1,
      label: '一级 1',
      children: [
        {
          id: 4,
          label: '二级 1-1',
          children: [
            {
              id: 9,
              label: '三级 1-1-1'
            },
            {
              id: 10,
              label: '三级 1-1-2'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      label: '一级 2',
      children: [
        {
          id: 5,
          label: '二级 2-1'
        },
        {
          id: 6,
          label: '二级 2-2'
        }
      ]
    },
    {
      id: 3,
      label: '一级 3',
      children: [
        {
          id: 7,
          label: '二级 3-1'
        },
        {
          id: 8,
          label: '二级 3-2',
          isAsync: true
        }
      ]
    }
  ]
  return data
}

describe('Tree.vue', () => {
  describe('props', () => {
    it('data', async () => {
      const tree = mount(Tree, {
        props: {
          data: createData(),
          defaultNodeKey: {
            childNodes: 'children'
          },
          defaultExpandAll: true
        }
      })

      const node10 = tree.find('#TreeNode10')
      const node6 = tree.find('#TreeNode6')

      expect(node10.exists()).toBeTruthy()
      expect(node6.exists()).toBeTruthy()
    })
  })

  describe('events', () => {
    it('node-click', () => {
      const tree = mount(Tree, {
        props: {
          data: createData(),
          defaultNodeKey: {
            childNodes: 'children'
          },
          defaultExpandAll: true,
          'onNode-click'(node) {
            expect(node.id).toBe(6)
          }
        }
      })

      const node6 = tree.find('#TreeNode6')

      expect(node6.exists()).toBeTruthy()

      node6.trigger('click')
    })
  })
})
