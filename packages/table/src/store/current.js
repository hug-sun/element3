import { arrayFind } from '../../../../src/utils/util'
import { getRowIdentity } from '../util'
import { ref, getCurrentInstance, unref } from 'vue'

function useCurrent(watcherData) {
  const instance = getCurrentInstance()
  const _currentRowKey = ref(null)
  const currentRow = ref(null)

  const setCurrentRowKey = (key) => {
    instance.store.assertRowKey()
    _currentRowKey.value = key
    setCurrentRowByKey(key)
  }

  const restoreCurrentRowKey = () => {
    _currentRowKey.value = null
  }

  const setCurrentRowByKey = (key) => {
    const { data = [], rowKey } = watcherData
    let _currentRow = null
    if (rowKey.value) {
      _currentRow = arrayFind(
        unref(data),
        (item) => getRowIdentity(item, rowKey.value) === key
      )
    }
    currentRow.value = _currentRow
  }

  const updateCurrentRow = (_currentRow) => {
    const oldCurrentRow = currentRow.value
    if (_currentRow && _currentRow !== oldCurrentRow) {
      currentRow.value = _currentRow
      instance.emit('current-change', currentRow.value, oldCurrentRow)
      return
    }
    if (!_currentRow && oldCurrentRow) {
      currentRow.value = null
      instance.emit('current-change', null, oldCurrentRow)
    }
  }

  const updateCurrentRowData = () => {
    const rowKey = watcherData.rowKey.value
    // data 为 null 时，解构时的默认值会被忽略
    const data = watcherData.data.value || []
    const oldCurrentRow = currentRow.value

    // 当 currentRow 不在 data 中时尝试更新数据
    if (data.indexOf(oldCurrentRow) === -1 && oldCurrentRow) {
      if (rowKey) {
        const currentRowKey = getRowIdentity(oldCurrentRow, rowKey)
        setCurrentRowByKey(currentRowKey)
      } else {
        currentRow.value = null
      }
      if (currentRow.value === null) {
        instance.emit('current-change', null, oldCurrentRow)
      }
    } else if (_currentRowKey.value) {
      // 把初始时下设置的 rowKey 转化成 rowData
      setCurrentRowByKey(_currentRowKey.value)
      restoreCurrentRowKey()
    }
  }

  return {
    setCurrentRowKey,
    restoreCurrentRowKey,
    setCurrentRowByKey,
    updateCurrentRow,
    updateCurrentRowData,
    states: {
      _currentRowKey,
      currentRow
    }
  }
}

export default useCurrent
