import { mount } from '@vue/test-utils'
import { nextTick, reactive } from 'vue'
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
        modelValue: rawNodes
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
        modelValue: rawNodes
      }
    })

    expect(wrapper.text()).toEqual(t('el.tree.emptyText'))
  })
  it('reactive tree data', async () => {
    const wrapper = mount({
      template: `
        <el-Tree-main v-model="nodes"></el-Tree-main>
      `,
      components: { elTreeMain: TreeMain },
      setup() {
        const nodes = reactive([
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
        <el-Tree-main v-model="nodes"></el-Tree-main>
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
})
