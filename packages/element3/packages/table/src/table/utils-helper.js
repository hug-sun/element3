function useUtils(store, layout, shouldUpdateHeight) {
  const setCurrentRow = (row) => {
    store.commit('setCurrentRow', row)
  }
  const toggleRowSelection = (row, selected) => {
    store.toggleRowSelection(row, selected, false)
    store.updateAllSelected()
  }
  const clearSelection = () => {
    store.clearSelection()
  }
  const clearFilter = (columnKeys) => {
    store.clearFilter(columnKeys)
  }
  const toggleAllSelection = () => {
    store.commit('toggleAllSelection')
  }
  const toggleRowExpansion = (row, expanded) => {
    store.toggleRowExpansionAdapter(row, expanded)
  }
  const clearSort = () => {
    store.clearSort()
  }
  const doLayout = () => {
    if (shouldUpdateHeight.value) {
      layout.updateElsHeight()
    }
    layout.updateColumnsWidth()
  }
  const sort = (prop, order) => {
    store.commit('sort', { prop, order })
  }

  return {
    setCurrentRow,
    toggleRowSelection,
    clearSelection,
    clearFilter,
    toggleAllSelection,
    toggleRowExpansion,
    clearSort,
    doLayout,
    sort
  }
}

export default useUtils
