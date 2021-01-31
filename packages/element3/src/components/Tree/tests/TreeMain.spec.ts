import { mount } from '@vue/test-utils'
import { nextTick, reactive, ref } from 'vue'
import { t } from '../../../locale'
import TreeMain from '../src/TreeMain.vue'

describe('TreeMain.vue', () => {
  it('show tree data', () => {
    const rawNodes = [
      {
        id: 1,
        label: 'Node1',
        children: [
          {
            id: 11,
            label: 'Node1-1'
          }
        ]
      },
      {
        id: 2,
        label: 'Node2'
      }
    ]
    const wrapper = mount(TreeMain, {
      props: {
        modelValue: rawNodes,
        renderAfterExpand: false
      }
    })

    expect(wrapper.find('#TreeNode1').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode11').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode2').exists()).toBeTruthy()
  })

  it('when modelValue is null', () => {
    const rawNodes = []
    const wrapper = mount(TreeMain, {
      props: {
        modelValue: rawNodes,
        renderAfterExpand: false
      }
    })

    expect(wrapper.text()).toEqual(t('el.tree.emptyText'))
  })
  it('reactive tree data', async () => {
    const wrapper = mount({
      template: `
        <el-Tree-main v-model="nodes" :renderAfterExpand="false"></el-Tree-main>
      `,
      components: { elTreeMain: TreeMain },
      setup() {
        const nodes = ref([
          {
            id: 1,
            label: 'Node1',
            children: [
              {
                id: 11,
                label: 'Node1-1'
              }
            ]
          },
          {
            id: 2,
            label: 'Node2'
          }
        ])
        return {
          nodes
        }
      }
    })

    expect(wrapper.find('#TreeNode1').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode11').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode2').exists()).toBeTruthy()
    wrapper.vm.nodes.push({
      id: 3,
      label: 'Node3'
    })
    await nextTick()
    expect(wrapper.find('#TreeNode3').exists()).toBeTruthy()
    wrapper.vm.nodes.push({
      id: 4,
      label: 'Node4'
    })
    await nextTick()
    expect(wrapper.find('#TreeNode4').exists()).toBeTruthy()
  })
  it('reactive tree data(OptionsAPI)', async () => {
    const wrapper = mount({
      template: `
        <el-Tree-main v-model="nodes" :renderAfterExpand="false"></el-Tree-main>
      `,
      components: { elTreeMain: TreeMain },
      data() {
        return {
          nodes: [
            {
              id: 1,
              label: 'Node1',
              children: [
                {
                  id: 11,
                  label: 'Node1-1'
                }
              ]
            },
            {
              id: 2,
              label: 'Node2'
            }
          ]
        }
      }
    })

    expect(wrapper.find('#TreeNode1').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode11').exists()).toBeTruthy()
    expect(wrapper.find('#TreeNode2').exists()).toBeTruthy()
    wrapper.vm.nodes.push({
      id: 3,
      label: 'Node3'
    })
    await nextTick()
    expect(wrapper.find('#TreeNode3').exists()).toBeTruthy()
  })

  it('Realize node multi - selection function', async () => {
    const wrapper = mount({
      template: `
        <el-Tree-main v-model="nodes" v-model:checked="checked" show-checkbox :renderAfterExpand="false"></el-Tree-main>
      `,
      components: { elTreeMain: TreeMain },
      setup() {
        const nodes = ref([
          {
            id: 1,
            label: 'Node1',
            children: [
              {
                id: 11,
                label: 'Node1-1'
              }
            ]
          },
          {
            id: 2,
            label: 'Node2'
          }
        ])
        const checked = ref([1])
        return {
          nodes,
          checked
        }
      }
    })

    await nextTick()
    expect(wrapper.find('#TreeNode1').classes()).toContain('is-checked')
    expect(wrapper.find('#TreeNode11').classes()).toContain('is-checked')
    expect(wrapper.vm.checked).toEqual([1, 11])

    const node2Checkbox = wrapper
      .findComponent('#TreeNode2')
      .findComponent({ name: 'ElCheckbox' })

    await node2Checkbox.trigger('click')
    expect(wrapper.vm.checked).toEqual([1, 11, 2])
  })

  it('Based on the check-on-click-node implementation, whether the node is selected when the node is clicked', async () => {
    const wrapper = mount({
      template: `
        <el-tree-main v-model="nodes" v-model:checked="checked" show-checkbox check-on-click-node :renderAfterExpand="false"></el-tree-main>
      `,
      components: { elTreeMain: TreeMain },
      setup() {
        const nodes = ref([
          {
            id: 1,
            label: 'Node1'
          },
          {
            id: 2,
            label: 'Node2'
          }
        ])
        const checked = ref([])
        return {
          nodes,
          checked
        }
      }
    })

    await nextTick()

    const node2 = wrapper.find('#TreeNode2 .el-tree-node__content')

    await node2.trigger('click')
    expect(wrapper.vm.checked).toEqual([2])
  })

  it('Implement, in the case of displaying checkboxes, whether to strictly follow the parent-child discordant practice', async () => {
    const wrapper = mount({
      template: `
        <el-tree-main v-model="nodes" v-model:checked="checked" show-checkbox check-strictly :renderAfterExpand="false"></el-tree-main>
      `,
      components: { elTreeMain: TreeMain },
      setup() {
        const nodes = ref([
          {
            id: 1,
            label: 'Node1',
            children: [
              {
                id: 2,
                label: 'Node2'
              }
            ]
          }
        ])
        const checked = ref([])
        return {
          nodes,
          checked
        }
      }
    })

    await nextTick()

    const node2 = wrapper.find('#TreeNode2 .el-tree-node__content input')

    await node2.trigger('click')
    expect(wrapper.vm.checked).toEqual([2])
  })

  it('expand a node', async () => {
    const rawNodes = [
      {
        id: 1,
        label: 'Node1',
        children: [
          {
            id: 11,
            label: 'Node1-1'
          }
        ]
      }
    ]
    const wrapper = mount(TreeMain, {
      props: {
        modelValue: rawNodes,
        renderAfterExpand: false
      }
    })
    await wrapper.find('#TreeNode1').trigger('click')
    expect(wrapper.find('#TreeNode1').classes()).toContain('is-expanded')
  })
})
