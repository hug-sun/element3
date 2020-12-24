import { ref, computed, watch, toRefs } from 'vue'
import Pager from './components/Pager'
import Prev from './components/Prev.vue'
import Next from './components/Next'
import Jumper from './components/Jumper'
import Total from './components/Total'
import Sizes from './components/Sizes'
import { valueEquals } from '../../src/utils/util'

const useLayout = (layout) => {
  const template = []
  const rightWrapper = []
  const components = layout.split(',').map((item) => item.trim())
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
      return innerPageSize.value ?? pageSize.value
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

    currentPage: {
      type: Number,
      default: 1
    },

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

  setup(props, { emit }) {
    const currentPageEmitted = ref(false)
    const pageSizeEmitted = ref(false)
    const {
      currentPage,
      total,
      pageCount,
      pageSize,
      disabled,
      pageSizes
    } = toRefs(props)

    const internalCurrentPage = useInternalCurrentPage({
      currentPage,
      emit,
      emitted: currentPageEmitted
    })
    const internalPageSize = userInternalPageSize({
      pageSize,
      pageSizes,
      emit,
      emitted: pageSizeEmitted
    })
    const { internalPageCount } = useInternalPageCount({
      pageCount,
      total,
      pageSize: internalPageSize
    })

    return {
      // state
      internalCurrentPage,
      internalPageCount,
      internalPageSize,
      // methods
      prev() {
        if (disabled.value) return
        internalCurrentPage.value = getValidCurrentPage(
          internalCurrentPage.value - 1,
          internalPageCount.value
        )
        emit('prevClick', internalCurrentPage.value)
      },
      next() {
        if (disabled.value) return
        internalCurrentPage.value = getValidCurrentPage(
          internalCurrentPage.value + 1,
          internalPageCount.value
        )
        emit('nextClick', internalCurrentPage.value)
      },
      onUpdate(val) {
        internalCurrentPage.value = val
      },
      handleChange(val) {
        internalCurrentPage.value = getValidCurrentPage(
          val,
          internalPageCount.value
        )
      },
      handleSizeChange(val) {
        if (val !== internalPageSize.value) {
          internalPageSize.value = val = parseInt(val, 10)
        }
      },
      watchHandler(newValue) {
        if (valueEquals(newValue, pageSizes.value)) return
        if (Array.isArray(newValue)) {
          internalPageSize.value =
            newValue.indexOf(internalPageSize.value) > -1
              ? internalPageSize.value
              : pageSizes.value[0]
        }
      }
    }
  },
  render() {
    if (!this.layout || (this.hideOnSinglePage && this.internalPageCount === 1))
      return ''

    const { template, rightWrapper } = useLayout(this.layout)

    const templateComponent = {
      prev: (
        <Prev
          currentPage={this.internalCurrentPage}
          disabled={this.disabled}
          prevText={this.prevText}
          prev={this.prev}
        />
      ),
      jumper: (
        <Jumper
          currentPage={this.internalCurrentPage}
          pageCount={this.internalPageCount}
          disabled={this.disabled}
          onChange={this.handleChange}
        />
      ),
      pager: (
        <Pager
          currentPage={this.internalCurrentPage}
          v-model={[this.internalCurrentPage, 'currentPage']}
          pageCount={this.internalPageCount}
          disabled={this.disabled}
        />
      ),
      next: (
        <Next
          currentPage={this.internalCurrentPage}
          pageCount={this.internalPageCount}
          disabled={this.disabled}
          nextText={this.nextText}
          next={this.next}
        />
      ),
      sizes: (
        <Sizes
          pageSizes={this.pageSizes}
          pageSize={this.internalPageSize}
          popperClass={this.popperClass}
          handleChange={this.handleSizeChange}
          disabled={this.disabled}
          watchHandler={this.watchHandler}
        />
      ),
      slot: <>{this.$slots.default?.()}</>,
      total: <Total total={this.total} />
    }

    return (
      <div
        class={[
          'el-pagination',
          {
            'is-background': this.background,
            'el-pagination--small': this.small
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
