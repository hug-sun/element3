<script lang="ts">
import { TreeNode } from './entity/TreeNode'
import { h } from 'vue'
export default {
  name: 'ElNodeContent',

  props: {
    node: {
      required: true,
      type: TreeNode
    }
  },

  setup(props) {
    return () => {
      return h('span', props.node.label)
    }
  }
}
</script>
