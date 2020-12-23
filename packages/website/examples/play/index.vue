<template>
  <el-tree
    :data="data"
    :defaultNodeKey="defaultNodeKey"
    @node-click="handleNodeClick"
  ></el-tree>
  <button @click="onClick('add')">ADD</button>
  <button @click="onClick('del')">DEL</button>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          label: '一级 1',
          children: []
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
      ],
      defaultNodeKey: {
        childNodes: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick(node) {
      console.log(node)
    },
    onClick(e) {
      if (e === 'add') {
        this.data[0].children = [
          {
            label: Math.random() * 1000,
            t: 55
          }
        ]
      } else {
        this.data[0].children.pop()
      }
    }
  }
}
</script>
