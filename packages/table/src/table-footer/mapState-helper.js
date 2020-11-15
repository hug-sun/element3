import { computed, getCurrentInstance } from 'vue'

function useMapState() {
  const instance = getCurrentInstance()
  const table = instance.parent
  const store = table.store
  const leftFixedLeafCount = computed(() => {
    return store.states.fixedLeafColumnsLength.value
  })
  const rightFixedLeafCount = computed(() => {
    return store.states.rightFixedColumns.value.length
  })
  const columnsCount = computed(() => {
    return store.states.columns.value.length
  })
  const leftFixedCount = computed(() => {
    return store.states.fixedColumns.value.length
  })
  const rightFixedCount = computed(() => {
    return store.states.rightFixedColumns.value.length
  })

  return {
    leftFixedLeafCount,
    rightFixedLeafCount,
    columnsCount,
    leftFixedCount,
    rightFixedCount,
    columns: store.states.columns
  }
}

export default useMapState
