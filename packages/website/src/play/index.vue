<template>
  <el-tree
    v-model="nodes"
    v-model:checked="checked"
    ref="tree"
    :show-checkbox="true"
    :checkOnClickNode="true"
  ></el-tree>
</template>

<script>
import { getCurrentInstance, reactive, ref } from 'vue'
export default {
  setup() {
    const vm = getCurrentInstance().proxy

    const nodes = ref([
      {
        label: '一级 1',
        children: [
          {
            label: '二级 1-1',
            children: [
              {
                label: '三级 1-1-1'
              }
            ]
          }
        ]
      },
      {
        label: '一级 2',
        children: [
          {
            label: '二级 2-1',
            children: [
              {
                label: '三级 2-1-1'
              }
            ]
          },
          {
            label: '二级 2-2',
            children: [
              {
                label: '三级 2-2-1'
              }
            ]
          }
        ]
      },
      {
        label: '一级 3',
        children: [
          {
            label: '二级 3-1',
            children: [
              {
                label: '三级 3-1-1'
              }
            ]
          },
          {
            label: '二级 3-2',
            children: [
              {
                label: '三级 3-2-1'
              }
            ]
          }
        ]
      }
    ])

    const checked = ref([1])

    // setTimeout(() => {
    //   console.log(nodes, vm.nodes)
    //   nodes.value[0].label = 'TTT'
    //   nodes.value[0].children[0].label = 'TTT'
    //   nodes.value.push({
    //     label: 'Hello'
    //   })
    //   const tree = vm.$refs.tree.$refs.treeMain.tree
    //   tree.root.removeChild(0)
    //   nodes.value[0].children.push({
    //     label: 'Hello'
    //   })
    //   console.log(checked)
    // }, 3000)
    setTimeout(() => {
      checked.value.push(11)
    }, 1000)

    return {
      nodes,
      checked
    }
  }
}
</script>
