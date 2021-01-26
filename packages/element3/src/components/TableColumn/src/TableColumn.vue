<template>
  <div></div>
</template>
<script>
import { defineComponent, getCurrentInstance, inject, onMounted } from 'vue'
export default defineComponent({
  name: 'ElNewTableColumn',
  props: ['prop', 'label'],
  setup() {
    registrySelfToParent()
  }
})

function registrySelfToParent() {
  const instance = getCurrentInstance()
  const table = inject('table')

  if (table) {
    table.registryColumn(instance)
  }
}
</script>

<style></style>
