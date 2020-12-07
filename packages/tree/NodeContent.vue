<script>
import { TreeNode } from './entity/TreeNode'
import { inject, h } from 'vue'
export default {
  name: 'ElNodeContent',

  props: {
    node: {
      required: true,
      type: TreeNode
    }
  },

  render(ctx) {
    const elTree = inject('elTree')
    if (typeof elTree.slots.default === 'function') {
      return elTree.slots.default({ node: ctx.node, data: ctx.node.data.raw })
    } else if (typeof elTree.props.renderContent === 'function') {
      return elTree.props.renderContent({
        node: ctx.node,
        data: ctx.node.data.raw
      })
    }

    return h('span', ctx.node.label)
  }
}
</script>
