import { ref, computed, watch, h, toRefs, Fragment } from 'vue'
import Pager from './components/Pager'
import Prev from './components/Prev.vue'
import Next from './components/Next'
import Jumper from './components/Jumper'
import Total from './components/Total'

const useLayout = (layout) => {
  const template = []
  const rightWrapper = []
  const components = layout.value.split(',').map((item) => item.trim())
  const findIndex = components.findIndex((item) => item === '->')
  for (let i = 0; i < components.length; i++) {
    if (findIndex >= 0) {
      if (i === findIndex) continue
      if (i < findIndex) {
        template.push(components[i])
      } else {
        rightWrapper.push(components[i])
      }
    } else {
      template.push(components[i])
    }
  }

  return {
    template,
    rightWrapper
  }
}

const getValidCurrentPage = (value, pageCount) => {
  value = parseInt(value, 10)

  const havePageCount = typeof pageCount === 'number'

  let resetValue
  if (!havePageCount) {
    if (isNaN(value) || value < 1) resetValue = 1
  } else {
    if (value < 1) {
      resetValue = 1
    } else if (value > pageCount) {
      resetValue = pageCount
    }
  }

  if ((resetValue === undefined && isNaN(value)) || resetValue === 0) {
    resetValue = 1
  }

  return resetValue ?? value
}

const useInternalCurrentPage = ({ currentPage, emit, emitted }) => {
  const innerCurrentPage = ref(null)
  return computed({
    get() {
      return innerCurrentPage.value ?? currentPage?.value ?? 1
    },
    set(v) {
      emit('update:currentPage', v)
      emit('currentChange', v)
      if (currentPage) {
        watch(currentPage, () => {
          emitted.value = true
        })
      }
      if (emitted.value) innerCurrentPage.value = null
      else innerCurrentPage.value = v
      emitted.value = false
    }
  })
}

const userInternalPageSize = ({ pageSize, emit, emitted }) => {
  const innerPageSize = ref(null)
  return computed({
    get() {
      return innerPageSize.value ?? pageSize?.value
    },
    set(v) {
      emit('update:pageSize', v)
      emit('sizeChange', v)
      innerPageSize.value = v
      if (pageSize) {
        watch(pageSize, () => {
          emitted.value = true
        })
      }
      if (emitted.value) innerPageSize.value = null
      emitted.value = false
    }
  })
}

const useInternalPageCount = ({ pageCount, total, pageSize }) => {
  const internalPageCount = computed(() => {
    if (!total && !pageCount) return 5
    if (typeof total?.value === 'number') {
      return Math.max(1, Math.ceil(total.value / pageSize.value))
    } else if (typeof pageCount?.value === 'number') {
      return Math.max(1, pageCount.value)
    }
  })

  return {
    internalPageCount
  }
}

export default {
  name: 'ElPagination',

  props: {
    pageSize: {
      type: Number,
      default: 10
    },

    small: Boolean,

    total: Number,

    pageCount: Number,

    pagerCount: {
      type: Number,
      validator(value) {
        return (
          (value || 0) === value && value > 4 && value < 22 && value % 2 === 1
        )
      },
      default: 7
    },

    currentPage: Number,

    layout: {
      default: 'prev, pager, next, jumper, ->, total'
    },

    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40, 50, 100]
      }
    },

    popperClass: String,

    prevText: String,

    nextText: String,

    background: Boolean,

    disabled: Boolean,

    hideOnSinglePage: Boolean
  },

  emits: [
    'update:currentPage',
    'update:pageSize',
    'currentChange',
    'sizeChange',
    'prevClick',
    'nextClick'
  ],

  setup(props, { emit, slots }) {
    const currentPageEmitted = ref(false)
    const pageSizeEmitted = ref(false)
    const {
      layout,
      small,
      background,
      currentPage,
      total,
      pageCount,
      pageSize,
      disabled,
      hideOnSinglePage
    } = toRefs(props)

    if (!layout.value) return null

    const internalCurrentPage = useInternalCurrentPage({
      currentPage,
      emit,
      emitted: currentPageEmitted
    })
    const internalPageSize = userInternalPageSize({
      pageSize,
      emit,
      emitted: pageSizeEmitted
    })
    const { internalPageCount } = useInternalPageCount({
      pageCount,
      total,
      pageSize: internalPageSize
    })

    if (hideOnSinglePage && internalPageCount.value === 1) return null

    const { template, rightWrapper } = useLayout(layout)

    return () => {
      const templateComponent = {
        prev: h(Prev, {
          currentPage: internalCurrentPage.value,
          disabled: disabled.value,
          prevText: props.prevText,
          prev() {
            if (disabled.value) return
            internalCurrentPage.value = getValidCurrentPage(
              internalCurrentPage.value - 1,
              internalPageCount.value
            )
            emit('prevClick', internalCurrentPage.value)
          }
        }),
        jumper: h(Jumper, {
          currentPage: internalCurrentPage.value,
          pageCount: internalPageCount.value,
          handleChange(val) {
            internalCurrentPage.value = getValidCurrentPage(
              val,
              internalPageCount.value
            )
          },
          disabled: disabled.value
        }),
        pager: h(Pager, {
          currentPage: internalCurrentPage.value,
          'onUpdate:currentPage'(val) {
            internalCurrentPage.value = val
          },
          pageCount: internalPageCount.value,
          disabled: disabled.value
        }),
        next: h(Next, {
          currentPage: internalCurrentPage.value,
          pageCount: internalPageCount.value,
          disabled: disabled.value,
          nextText: props.nextText,
          next() {
            if (disabled.value) return
            internalCurrentPage.value = getValidCurrentPage(
              internalCurrentPage.value + 1,
              internalPageCount.value
            )
            emit('nextClick', internalCurrentPage.value)
          }
        }),
        // sizes: <sizes pageSizes={this.pageSizes}></sizes>,
        slot: h(Fragment, slots.default?.() ?? ''),
        total: h(Total, {
          total: total?.value
        })
      }

      return (
        <div
          class={[
            'el-pagination',
            {
              'is-background': background.value,
              'el-pagination--small': small.value
            }
          ]}
        >
          {rightWrapper.length ? (
            <div className="el-pagination__rightwrapper">
              {rightWrapper.map((item) => {
                const Comp = templateComponent[item]
                return <Comp />
              })}
            </div>
          ) : (
            ''
          )}

          {template.map((item) => {
            const Comp = templateComponent[item]
            return <Comp />
          })}
        </div>
      )
    }
  }
}
