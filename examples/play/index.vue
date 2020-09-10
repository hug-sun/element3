<template>
  <div class="custom-tree-container">

    <div class="block">
      <p>使用 scoped slot</p>
      <el-tree
        ref="elTree"
        show-checkbox
        draggable
        :data="data"
        :expandOnClickNode="false"
        :render-content="renderContent"
        :asyncLoadFn="load"
      >
        <template v-slot="{node, data}">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => append(node, data)"
              >
                Append
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)"
              >
                Delete
              </el-button>
            </span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { h } from 'vue';
let id = 1000;

export default {
  data () {
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2',
        isAsync: true
      }]
    }];
    return {
      data: JSON.parse(JSON.stringify(data))
    }
  },

  watch: {
    data: {
      deep: true,
      handler: function (val, oldVal) {
        console.log('val :>> ', val);
      }
    },
  },

  methods: {
    append (node, data) {
      const newChild = { id: id++, label: 'testtest', children: [] };
      if (!data.children) {
        data.children = [];
      }
      node.append(newChild);
      // data.children.push(newChild)
    },

    remove (node) {
      node.remove()
    },

    renderContent ({ node, data }) {
      return h('span', node.label)
      // return (
      //   <span class="custom-tree-node">
      //     <span>{node.label}</span>
      //     <span>
      //       <el-button size="mini" type="text" on-click={() => this.append(data)}>Append</el-button>
      //       <el-button size="mini" type="text" on-click={() => this.remove(node, data)}>Delete</el-button>
      //     </span>
      //   </span>);
    },

    load (node, resolve) {
      setTimeout(() => {
        resolve([{
          id: 7,
          label: '二级 3-1'
        }])
      }, 3000)
    }
  },
  async mounted () {
    this.$refs.elTree.append({
      id: 7,
      label: '二级 3-1'
    })
  },
};
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
html{
  /* margin: 300px; */
}
</style>
