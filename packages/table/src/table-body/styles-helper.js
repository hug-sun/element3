import { getCurrentInstance } from 'vue'

function useStyles(props) {
  const instance = getCurrentInstance()
  const parent = instance.parent
  const isColumnHidden = (index) => {
    if (props.fixed === 'left') {
      return index >= props.store.states.fixedLeafColumnsLength.value
    } else if (props.fixed === 'right') {
      return (
        index <
        props.store.states.columns.value.length -
          props.store.states.rightFixedLeafColumnsLength.value
      )
    } else {
      return (
        index < props.store.states.fixedLeafColumnsLength.value ||
        index >=
          props.store.states.columns.value.length -
            props.store.states.rightFixedLeafColumnsLength.value
      )
    }
  }
  const getRowStyle = (row, rowIndex) => {
    const rowStyle = parent.props.rowStyle
    if (typeof rowStyle === 'function') {
      return rowStyle.call(null, {
        row,
        rowIndex
      })
    }
    return rowStyle || null
  }

  const getRowClass = (row, rowIndex) => {
    const classes = ['el-table__row']
    if (
      parent.props.highlightCurrentRow &&
      row === props.store.states.currentRow.value
    ) {
      classes.push('current-row')
    }

    if (props.stripe && rowIndex % 2 === 1) {
      classes.push('el-table__row--striped')
    }
    const rowClassName = parent.props.rowClassName
    if (typeof rowClassName === 'string') {
      classes.push(rowClassName)
    } else if (typeof rowClassName === 'function') {
      classes.push(
        rowClassName.call(null, {
          row,
          rowIndex
        })
      )
    }

    if (props.store.states.expandRows.value.indexOf(row) > -1) {
      classes.push('expanded')
    }

    return classes
  }

  const getCellStyle = (rowIndex, columnIndex, row, column) => {
    const cellStyle = parent.props.cellStyle
    if (typeof cellStyle === 'function') {
      return cellStyle.call(null, {
        rowIndex,
        columnIndex,
        row,
        column
      })
    }
    return cellStyle
  }

  const getCellClass = (rowIndex, columnIndex, row, column) => {
    const classes = [column.id, column.align, column.className]

    if (isColumnHidden(columnIndex)) {
      classes.push('is-hidden')
    }

    const cellClassName = parent.props.cellClassName
    if (typeof cellClassName === 'string') {
      classes.push(cellClassName)
    } else if (typeof cellClassName === 'function') {
      classes.push(
        cellClassName.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        })
      )
    }

    return classes.join(' ')
  }
  const getSpan = (row, column, rowIndex, columnIndex) => {
    let rowspan = 1
    let colspan = 1
    const fn = parent.props.spanMethod
    if (typeof fn === 'function') {
      const result = fn({
        row,
        column,
        rowIndex,
        columnIndex
      })
      if (Array.isArray(result)) {
        rowspan = result[0]
        colspan = result[1]
      } else if (typeof result === 'object') {
        rowspan = result.rowspan
        colspan = result.colspan
      }
    }
    return { rowspan, colspan }
  }
  const getColspanRealWidth = (columns, colspan, index) => {
    if (colspan < 1) {
      return columns[index].realWidth
    }
    const widthArr = columns
      .map(({ realWidth }) => realWidth)
      .slice(index, index + colspan)
    return widthArr.reduce((acc, width) => acc + width, -1)
  }

  return {
    getRowStyle,
    getRowClass,
    getCellStyle,
    getCellClass,
    getSpan,
    getColspanRealWidth,
    isColumnHidden
  }
}

export default useStyles
