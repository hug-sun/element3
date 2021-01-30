<template>
  <el-tree v-model="nodes.value"></el-tree>
</template>

<script>
import { getCurrentInstance, reactive, ref } from 'vue'
export default {
  // data() {
  //   return {
  //     data: [
  //       {
  //         label: '一级 1',
  //         children: [
  //           {
  //             label: '二级 1-1',
  //             children: [
  //               {
  //                 label: '三级 1-1-1'
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         label: '一级 2',
  //         children: [
  //           {
  //             label: '二级 2-1',
  //             children: [
  //               {
  //                 label: '三级 2-1-1'
  //               }
  //             ]
  //           },
  //           {
  //             label: '二级 2-2',
  //             children: [
  //               {
  //                 label: '三级 2-2-1'
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         label: '一级 3',
  //         children: [
  //           {
  //             label: '二级 3-1',
  //             children: [
  //               {
  //                 label: '三级 3-1-1'
  //               }
  //             ]
  //           },
  //           {
  //             label: '二级 3-2',
  //             children: [
  //               {
  //                 label: '三级 3-2-1'
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ],
  //     defaultProps: {
  //       children: 'children',
  //       label: 'label'
  //     }
  //   }
  // },
  // methods: {
  //   handleNodeClick(data) {
  //     console.log(data)
  //   }
  // },
  // mounted() {
  //   setTimeout(() => {
  //     this.data.push({
  //       label: 'Hello'
  //     })
  //   }, 1000)
  // },
  setup() {
    const vm = getCurrentInstance().proxy

    function reft(v) {
      return {
        value: v
      }
    }

    const nodes = reft([
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

    setTimeout(() => {
      console.log(nodes, vm.nodes)
      nodes.value[0].label = 'TTT'
      nodes.value[0].children[0].label = 'TTT'
      nodes.value.push({
        label: 'Hello'
      })
      nodes.value[0].children.push({
        label: 'Hello'
      })
    }, 3000)

    return {
      nodes
    }
  }
}
</script>
