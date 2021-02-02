<script lang="ts">
import { TreeNode } from './entity/TreeNode'
import { h, inject } from 'vue'
export default {
  name: 'ElNodeContent',

  props: {
    node: {
      required: true,
      type: TreeNode
    }
  },

  setup(props) {
    const elTree: any = inject('elTree')
    return () => {
      if (typeof elTree.$slots.default === 'function') {
        return elTree.$slots.default({
          node: props.node,
          data: elTree.tree.getRawNode(props.node)
        })
      } else if (typeof elTree.renderContent === 'function') {
        return elTree.renderContent({
          node: props.node,
          data: elTree.tree.getRawNode(props.node)
        })
      }

      return h('span', props.node.label)
    }
  }
}
</script>
