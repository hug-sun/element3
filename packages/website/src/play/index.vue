<template>
  <!-- <el-new-table :data="tableData">
    <el-new-table-column prop="date" label="日期" width="180">
    </el-new-table-column>
  </el-new-table> -->
  <div>
    <el-button>默认按钮</el-button>
    <!-- {{ state.list }} -->
    {{ list }}
    <button @click="handleClick">click</button>
  </div>
</template>
<script>
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          time: 10
        },
        {
          date: '2016-05-03',
          time: 11
        }
      ]
    }
  },
  setup() {
    // let state = reactive({
    //   list: []
    // })
    let list = reactive([])
    const handleClick = () => {
      // state.list = [1, 2, 3]
      list = [1, 2, 3]
    }

    return {
      // state,
      list,
      handleClick
    }
  }
})
</script>
