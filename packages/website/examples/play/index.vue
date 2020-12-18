<template>
  <el-rate
    v-model="value"
    :icon-classes="iconClasses"
    void-icon-class="icon-rate-face-off"
    :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
  >
  </el-rate>
</template>
<script>
import { ref, reactive, toRefs } from 'vue'
export default {
  setup() {
    const value = ref(null)
    const data = reactive({
      iconClasses: {
        2: 'icon-rate-face-1',
        4: { value: 'icon-rate-face-2', excluded: true },
        5: 'icon-rate-face-3'
      } // 等同于 { 2: 'icon-rate-face-1', 4: { value: 'icon-rate-face-2', excluded: true }, 5: 'icon-rate-face-3' }
    })
    return {
      value,
      ...toRefs(data)
    }
  }
}
</script>
