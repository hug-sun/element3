<template>
  <input v-model="text" type="text" />
  <el-tree
    v-model="nodes"
    v-model:expanded="checked"
    ref="tree"
    :show-checkbox="true"
    :accordion="false"
    :checkOnClickNode="false"
    :checkStrictly="false"
    :defaultExpandAll="true"
    :filterNodeMethod="null"
    :defaultNodeKey="{
      isDisabled: 'disabled'
    }"
  ></el-tree>
</template>

<script>
import { getCurrentInstance, reactive, ref, watch } from 'vue'
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
            disabled: true,
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

    const checked = ref([])
    const text = ref('')

    setTimeout(() => {
      checked.value.push(11)
      const root = vm.$refs.tree.$refs.treeMain.tree.root
    }, 1000)

    watch(text, (v) => {
      vm.$refs.tree.filter(v)
    })

    return {
      nodes,
      checked,
      text
    }
  }
}
</script>
