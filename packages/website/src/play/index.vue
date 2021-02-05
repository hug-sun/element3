<template>
  <el-tree
    v-model="data"
    :props="props"
    :load="loadNode"
    :lazy="false"
    show-checkbox
    defaultExpandAll
    draggable
  >
  </el-tree>
  <!-- <template #default="{ node, data }">
      <span style="color: red">{{ node.level }}</span>
      <span style="color: blue">{{ data.name }}</span>
    </template> -->
  <button @click="onClick">ADD</button>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          name: 'hello'
        },
        {
          name: 'hello1'
        }
      ],
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      }
    }
  },
  methods: {
    onClick() {
      this.data[0].zones[1].zones = [
        { name: 'Hello1' },
        { name: 'Hello2' },
        { name: 'Hello3' }
      ]
    },
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
