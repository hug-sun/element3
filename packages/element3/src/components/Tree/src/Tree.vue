<template>
  <el-tree-main
    ref="treeMain"
    v-model="_modelValue"
    :defaultNodeKey="_defaultNodeKey"
  ></el-tree-main>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import ElTreeMain from './TreeMain.vue'
/**
 * Compatibility layer components designed for older APIs.
 */
export default defineComponent({
  name: 'ElTree',
  components: { ElTreeMain },
  props: {
    data: Array,
    modelValue: Array,

    defaultNodeKey: Object,
    props: Object
  },
  emits: ['update:modelValue', 'update:data'],
  computed: {
    _modelValue: {
      get() {
        return this.modelValue ?? this.data
      },
      set(v) {
        this.$emit('update:modelValue', v)
        this.$emit('update:data', v)
      }
    },
    _defaultNodeKey() {
      return this.defaultNodeKey ?? this.props
    }
  }
})
</script>
