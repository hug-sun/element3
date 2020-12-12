<template>
    <textarea class="el-textarea__inner" v-bind="$attrs"></textarea>
</template>
<script>

import {defineComponent} from 'vue'
export default defineComponent({
  name: 'InputTextArea',

  componentName: 'InputTextArea',
  inheritAttrs: true,
  setup() {
    return {

    }
  }
})
</script>
