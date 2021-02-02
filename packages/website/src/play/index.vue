<template>
  <el-tree
    v-model="data"
    :props="props"
    :load="loadNode"
    lazy
    show-checkbox
    defaultExpandAll
  >
  </el-tree>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      }
    }
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region' }])
      }
      if (node.level > 2) return resolve([])

      setTimeout(() => {
        const data = [
          {
            name: 'leaf',
            leaf: true
          },
          {
            name: 'zone'
          }
        ]

        resolve(data)
      }, 500)
    }
  }
}
</script>
