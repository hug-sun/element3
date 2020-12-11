import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
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

    it('async', async () => {
      let id = 1
      const asyncLoadFn = (node, resolve) => {
        if (node.level < 3) {
          resolve([
            {
              id: ++id,
              label: 'T' + id
            },
            {
              id: ++id,
              label: 'T' + id
            },
            {
              id: ++id,
              label: 'T' + id
            }
          ])
        }
      }
      const tree = mount(Tree, {
        props: {
          data: [
            {
              id: 1,
              label: 'T1'
            }
          ],
          defaultExpandAll: true,
          async: true,
          asyncLoadFn: asyncLoadFn
        }
      })
      const root = tree.vm.root
      root.childNodes[0].expand()
      expect(root.childNodes[0].childNodes).toHaveLength(3)
    })

    it('async and checked', async () => {
      let id = 1
      const asyncLoadFn = (node, resolve) => {
        if (node.level < 3) {
          resolve([
            {
              id: ++id,
              label: 'T' + id
            },
            {
              id: ++id,
              label: 'T' + id
            },
            {
              id: ++id,
              label: 'T' + id
            }
          ])
        }
      }
      const tree = mount(Tree, {
        props: {
          data: [
            {
              id: 1,
              label: 'T1'
            }
          ],
          defaultExpandAll: true,
          async: true,
          showCheckbox: true,
          asyncLoadFn: asyncLoadFn
        }
      })
      const root = tree.vm.root
      const t1 = root.childNodes[0]
      t1.expand()
      t1.setChecked(true)
      expect(t1.checkedNodes.length).toBe(3)
      t1.childNodes[0].setChecked(false)
      expect(t1.checkedNodes.length).toBe(2)
      expect(t1.isChecked && !t1.isIndeterminate).toBe(false) // when isIndeterminate=false and isChecked=true, t1 checkbox is checked state
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

  describe('v-model', () => {
    it('checked', async () => {
      const checked = ref([2])

      const tree = mount(Tree, {
        props: {
          data: createData(),
          defaultNodeKey: {
            childNodes: 'children'
          },
          defaultExpandAll: true,
          showCheckbox: true,
          checked: checked.value,
          'onUpdate:checked': (e) => (checked.value = e)
        }
      })
      await nextTick()
      const node4 = tree.find('#TreeNode4 input')
      await node4.trigger('click')
      await nextTick()
      expect(checked.value).toStrictEqual(['1', '2', '4', '9', '10'])
    })
  })
})
