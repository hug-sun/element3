import { h, getCurrentInstance, computed } from 'vue'
import useEvents from './events-helper'
import useStyles from './styles-helper'
import { arrayFindIndex } from '../../../../src/utils/util'
import { getRowIdentity } from '../util'

function useRender(props) {
  const instance = getCurrentInstance()
  const parent = instance.parent
  const {
    handleDoubleClick,
    handleClick,
    handleContextMenu,
    handleMouseEnter,
    handleMouseLeave,
    handleCellMouseEnter,
    handleCellMouseLeave,
    tooltipVisible,
    tooltipContent,
    tooltipTrigger
  } = useEvents(props)
  const {
    getRowStyle,
    getRowClass,
    getCellStyle,
    getCellClass,
    getSpan,
    getColspanRealWidth
  } = useStyles(props)
  const firstDefaultColumnIndex = computed(() => {
    return arrayFindIndex(
      props.store.states.columns.value,
      ({ type }) => type === 'default'
    )
  })
  const getKeyOfRow = (row, index) => {
    const rowKey = parent.props.rowKey
    if (rowKey) {
      return getRowIdentity(row, rowKey)
    }
    return index
  }
  const rowRender = (row, index_, treeRowData) => {
    const { indent, columns } = props.store.states
    const rowClasses = getRowClass(row, index_)
    let display = true
    if (treeRowData) {
      rowClasses.push('el-table__row--level-' + treeRowData.level)
      display = treeRowData.display
    }
    const displayStyle = display
      ? null
      : {
          display: 'none'
        }
    return h(
      'tr',
      {
        style: [displayStyle, getRowStyle(row, index_)],
        class: rowClasses,
        key: getKeyOfRow(row, index_),
        onDblclick: ($event) => handleDoubleClick($event, row),
        onClick: ($event) => handleClick($event, row),
        onContextmenu: ($event) => handleContextMenu($event, row),
        onMouseenter: () => handleMouseEnter(index_),
        onMouseleave: handleMouseLeave
      },
      columns.value.map((column, cellIndex) => {
        const { rowspan, colspan } = getSpan(row, column, index_, cellIndex)
        if (!rowspan || !colspan) {
          return null
        }
        const columnData = { ...column }
        columnData.realWidth = getColspanRealWidth(
          columns.value,
          colspan,
          cellIndex
        )
        // debugger;
        const data = {
          store: props.store,
          _self: props.context || parent,
          column: columnData,
          row,
          index_
        }
        if (cellIndex === firstDefaultColumnIndex.value && treeRowData) {
          data.treeNode = {
            indent: treeRowData.level * indent.value,
            level: treeRowData.level
          }
          if (typeof treeRowData.expanded === 'boolean') {
            data.treeNode.expanded = treeRowData.expanded
            // 表明是懒加载
            if ('loading' in treeRowData) {
              data.treeNode.loading = treeRowData.loading
            }
            if ('noLazyChildren' in treeRowData) {
              data.treeNode.noLazyChildren = treeRowData.noLazyChildren
            }
          }
        }
        return h(
          'td',
          {
            style: getCellStyle(index_, cellIndex, row, column),
            class: getCellClass(index_, cellIndex, row, column),
            rowspan,
            colspan,
            onMouseenter: ($event) => handleCellMouseEnter($event, row),
            onMouseleave: handleCellMouseLeave
          },
          [column.renderCell(data)]
        )
      })
    )
  }
  const wrappedRowRender = (row, index_) => {
    const store = props.store
    const { isRowExpanded, assertRowKey } = store
    const {
      treeData,
      lazyTreeNodeMap,
      childrenColumnName,
      rowKey
    } = store.states
    const hasExpandColumn = store.states.columns.value.some(
      ({ type }) => type === 'expand'
    )
    if (hasExpandColumn && isRowExpanded(row)) {
      const renderExpanded = parent.renderExpanded
      const tr = rowRender(row, index_, undefined)
      if (!renderExpanded) {
        console.error('[Element Error]renderExpanded is required.')
        return tr
      }
      // 使用二维数组，避免修改 index_
      return [
        [
          tr,
          h(
            'tr',
            {
              key: 'expanded-row__' + tr.key
            },
            [
              h(
                'td',
                {
                  colspan: store.states.columns.value.length,
                  class: 'el-table__expanded-cell'
                },
                [renderExpanded({ row, index_, store })]
              )
            ]
          )
        ]
      ]
    } else if (Object.keys(treeData.value).length) {
      assertRowKey()
      // TreeTable 时，rowKey 必须由用户设定，不使用 getKeyOfRow 计算
      // 在调用 rowRender 函数时，仍然会计算 rowKey，不太好的操作
      const key = getRowIdentity(row, rowKey.value)
      let cur = treeData.value[key]
      let treeRowData = null
      if (cur) {
        treeRowData = {
          expanded: cur.expanded,
          level: cur.level,
          display: true
        }
        if (typeof cur.lazy === 'boolean') {
          if (typeof cur.loaded === 'boolean' && cur.loaded) {
            treeRowData.noLazyChildren = !(cur.children && cur.children.length)
          }
          treeRowData.loading = cur.loading
        }
      }
      const tmp = [rowRender(row, index_, treeRowData)]
      // 渲染嵌套数据
      if (cur) {
        // currentRow 记录的是 index，所以还需主动增加 TreeTable 的 index
        let i = 0
        const traverse = (children, parent) => {
          if (!(children && children.length && parent)) return
          children.forEach((node) => {
            // 父节点的 display 状态影响子节点的显示状态
            const innerTreeRowData = {
              display: parent.display && parent.expanded,
              level: parent.level + 1,
              expanded: false,
              noLazyChildren: false,
              loading: false
            }
            const childKey = getRowIdentity(node, rowKey.value)
            if (childKey === undefined || childKey === null) {
              throw new Error('for nested data item, row-key is required.')
            }
            cur = { ...treeData.value[childKey] }
            // 对于当前节点，分成有无子节点两种情况。
            // 如果包含子节点的，设置 expanded 属性。
            // 对于它子节点的 display 属性由它本身的 expanded 与 display 共同决定。
            if (cur) {
              innerTreeRowData.expanded = cur.expanded
              // 懒加载的某些节点，level 未知
              cur.level = cur.level || innerTreeRowData.level
              cur.display = !!(cur.expanded && innerTreeRowData.display)
              if (typeof cur.lazy === 'boolean') {
                if (typeof cur.loaded === 'boolean' && cur.loaded) {
                  innerTreeRowData.noLazyChildren = !(
                    cur.children && cur.children.length
                  )
                }
                innerTreeRowData.loading = cur.loading
              }
            }
            i++
            tmp.push(rowRender(node, index_ + i, innerTreeRowData))
            if (cur) {
              const nodes =
                lazyTreeNodeMap.value[childKey] ||
                node[childrenColumnName.value]
              traverse(nodes, cur)
            }
          })
        }
        // 对于 root 节点，display 一定为 true
        cur.display = true
        const nodes =
          lazyTreeNodeMap.value[key] || row[childrenColumnName.value]
        traverse(nodes, cur)
      }
      return tmp
    } else {
      return rowRender(row, index_, undefined)
    }
  }

  return {
    wrappedRowRender,
    tooltipVisible,
    tooltipContent,
    tooltipTrigger
  }
}

export default useRender
