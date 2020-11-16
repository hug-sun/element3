import { nextTick, ref, isRef } from 'vue'
import scrollbarWidth from '../../../src/utils/scrollbar-width'
import { parseHeight } from './util'

class TableLayout {
  constructor(options) {
    this.observers = []
    this.table = null
    this.store = null
    this.columns = []
    this.fit = true
    this.showHeader = true
    this.height = ref(null)
    this.scrollX = ref(false)
    this.scrollY = ref(false)
    this.bodyWidth = ref(null)
    this.fixedWidth = ref(null)
    this.rightFixedWidth = ref(null)
    this.tableHeight = ref(null)
    this.headerHeight = ref(44)
    this.appendHeight = ref(0)
    this.footerHeight = ref(44)
    this.viewportHeight = ref(null)
    this.bodyHeight = ref(null)
    this.fixedBodyHeight = ref(null)
    this.gutterWidth = scrollbarWidth()
    for (const name in options) {
      // eslint-disable-next-line no-prototype-builtins
      if (options.hasOwnProperty(name)) {
        if (isRef(this[name])) {
          this[name].value = options[name]
        } else {
          this[name] = options[name]
        }
      }
    }
    if (!this.table) {
      throw new Error('table is required for Table Layout')
    }
    if (!this.store) {
      throw new Error('store is required for Table Layout')
    }
  }

  updateScrollY() {
    const height = this.height.value
    if (height === null) return false
    const bodyWrapper = this.table.refs.bodyWrapper
    if (this.table.vnode.el && bodyWrapper) {
      const body = bodyWrapper.querySelector('.el-table__body')
      const prevScrollY = this.scrollY.value
      const scrollY = body.offsetHeight > this.bodyHeight.value
      this.scrollY.value = scrollY
      return prevScrollY !== scrollY
    }
    return false
  }

  setHeight(value, prop = 'height') {
    if (typeof window === undefined) return
    const el = this.table.vnode.el
    value = parseHeight(value)
    this.height.value = Number(value)

    if (!el && (value || value === 0))
      return nextTick(() => this.setHeight(value, prop))

    if (typeof value === 'number') {
      el.style[prop] = value + 'px'
      this.updateElsHeight()
    } else if (typeof value === 'string') {
      el.style[prop] = value
      this.updateElsHeight()
    }
  }

  setMaxHeight(value) {
    this.setHeight(value, 'max-height')
  }

  getFlattenColumns() {
    const flattenColumns = []
    const columns = this.table.store.states.columns.value
    columns.forEach((column) => {
      if (column.isColumnGroup) {
        // eslint-disable-next-line prefer-spread
        flattenColumns.push.apply(flattenColumns, column.columns)
      } else {
        flattenColumns.push(column)
      }
    })

    return flattenColumns
  }

  updateElsHeight() {
    if (!this.table.$ready) return nextTick(() => this.updateElsHeight())
    const { headerWrapper, appendWrapper, footerWrapper } = this.table.refs
    this.appendHeight.value = appendWrapper ? appendWrapper.offsetHeight : 0

    if (this.showHeader && !headerWrapper) return

    // fix issue (https://github.com/ElemeFE/element/pull/16956)
    const headerTrElm = headerWrapper
      ? headerWrapper.querySelector('.el-table__header tr')
      : null
    const noneHeader = this.headerDisplayNone(headerTrElm)

    const headerHeight = (this.headerHeight.value = !this.showHeader
      ? 0
      : headerWrapper.offsetHeight)
    if (
      this.showHeader &&
      !noneHeader &&
      headerWrapper.offsetWidth > 0 &&
      (this.table.store.states.columns.value || []).length > 0 &&
      headerHeight < 2
    ) {
      return nextTick(() => this.updateElsHeight())
    }
    const tableHeight = (this.tableHeight.value = this.table.vnode.el.clientHeight)
    const footerHeight = (this.footerHeight.value = footerWrapper
      ? footerWrapper.offsetHeight
      : 0)
    if (this.height.value !== null) {
      this.bodyHeight.value =
        tableHeight - headerHeight - footerHeight + (footerWrapper ? 1 : 0)
    }
    this.fixedBodyHeight.value = this.scrollX.value
      ? this.bodyHeight.value - this.gutterWidth
      : this.bodyHeight.value

    const noData = !(
      this.store.states.data.value && this.store.states.data.value.length
    )
    this.viewportHeight.value = this.scrollX.value
      ? tableHeight - (noData ? 0 : this.gutterWidth)
      : tableHeight

    this.updateScrollY()
    this.notifyObservers('scrollable')
  }

  headerDisplayNone(elm) {
    if (!elm) return true
    let headerChild = elm
    while (headerChild.tagName !== 'DIV') {
      if (getComputedStyle(headerChild).display === 'none') {
        return true
      }
      headerChild = headerChild.parentElement
    }
    return false
  }

  updateColumnsWidth() {
    if (typeof window === undefined) return
    const fit = this.fit
    const bodyWidth = this.table.vnode.el.clientWidth
    let bodyMinWidth = 0

    const flattenColumns = this.getFlattenColumns()
    const flexColumns = flattenColumns.filter(
      (column) => typeof column.width !== 'number'
    )
    flattenColumns.forEach((column) => {
      // Clean those columns whose width changed from flex to unflex
      if (typeof column.width === 'number' && column.realWidth)
        column.realWidth = null
    })
    if (flexColumns.length > 0 && fit) {
      flattenColumns.forEach((column) => {
        bodyMinWidth += column.width || column.minWidth || 80
      })

      const scrollYWidth = this.scrollY.value ? this.gutterWidth : 0

      if (bodyMinWidth <= bodyWidth - scrollYWidth) {
        // DON'T HAVE SCROLL BAR
        this.scrollX.value = false

        const totalFlexWidth = bodyWidth - scrollYWidth - bodyMinWidth

        if (flexColumns.length === 1) {
          flexColumns[0].realWidth =
            (flexColumns[0].minWidth || 80) + totalFlexWidth
        } else {
          const allColumnsWidth = flexColumns.reduce(
            (prev, column) => prev + (column.minWidth || 80),
            0
          )
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth
          let noneFirstWidth = 0

          flexColumns.forEach((column, index) => {
            if (index === 0) return
            const flexWidth = Math.floor(
              (column.minWidth || 80) * flexWidthPerPixel
            )
            noneFirstWidth += flexWidth
            column.realWidth = (column.minWidth || 80) + flexWidth
          })

          flexColumns[0].realWidth =
            (flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth
        }
      } else {
        // HAVE HORIZONTAL SCROLL BAR
        this.scrollX.value = true
        flexColumns.forEach(function (column) {
          column.realWidth = column.minWidth
        })
      }

      this.bodyWidth.value = Math.max(bodyMinWidth, bodyWidth)
      this.table.state.resizeState.value.width = this.bodyWidth.value
    } else {
      flattenColumns.forEach((column) => {
        if (!column.width && !column.minWidth) {
          column.realWidth = 80
        } else {
          column.realWidth = column.width || column.minWidth
        }
        bodyMinWidth += column.realWidth
      })
      this.scrollX.value = bodyMinWidth > bodyWidth

      this.bodyWidth.value = bodyMinWidth
    }

    const fixedColumns = this.store.states.fixedColumns.value

    if (fixedColumns.length > 0) {
      let fixedWidth = 0
      fixedColumns.forEach(function (column) {
        fixedWidth += column.realWidth || column.width
      })

      this.fixedWidth.value = fixedWidth
    }

    const rightFixedColumns = this.store.states.rightFixedColumns.value
    if (rightFixedColumns.length > 0) {
      let rightFixedWidth = 0
      rightFixedColumns.forEach(function (column) {
        rightFixedWidth += column.realWidth || column.width
      })

      this.rightFixedWidth.value = rightFixedWidth
    }

    this.notifyObservers('columns')
    this.updateElsHeight()
  }

  addObserver(observer) {
    this.observers.push(observer)
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer)
    if (index !== -1) {
      this.observers.splice(index, 1)
    }
  }

  notifyObservers(event) {
    const observers = this.observers
    observers.forEach((observer) => {
      switch (event) {
        case 'columns':
          observer.state?.onColumnsChange(this)
          break
        case 'scrollable':
          observer.state?.onScrollableChange(this)
          break
        default:
          throw new Error(`Table Layout don't have event ${event}.`)
      }
    })
  }
}

export default TableLayout
