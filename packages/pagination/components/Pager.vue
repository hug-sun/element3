<template>
  <ul @click="onPagerClick" class="el-pager">
    <li
      :class="{ active: currentPage === 1, disabled }"
      v-if="pageCount > 0"
      class="number"
    >
      1
    </li>
    <li
      class="el-icon more btn-quickprev"
      :class="[quickClass.left, { disabled }]"
      v-if="showMore.left"
      @mouseenter="onMouseEnter('left')"
      @mouseleave="quickClass.left = 'el-icon-more'"
    ></li>
    <li
      v-for="pager in pagers"
      :key="pager"
      :class="{ active: currentPage === pager, disabled }"
      class="number"
    >
      {{ pager }}
    </li>
    <li
      class="el-icon more btn-quicknext"
      :class="[quickClass.right, { disabled }]"
      v-if="showMore.right"
      @mouseenter="onMouseEnter('right')"
      @mouseleave="quickClass.right = 'el-icon-more'"
    ></li>
    <li
      :class="{ active: currentPage === pageCount, disabled }"
      class="number"
      v-if="pageCount > 1"
    >
      {{ pageCount }}
    </li>
  </ul>
</template>

<script type="text/babel">
import { reactive, toRefs, watch, computed } from 'vue'

export default {
  name: 'ElPager',

  props: {
    currentPage: {
      type: Number,
      default: 1
    },

    pageCount: {
      type: Number,
      default: 5
    },

    pagerCount: {
      type: Number,
      default: 7
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:currentPage'],

  setup(props, { emit }) {
    const { currentPage, pageCount, pagerCount, disabled } = toRefs(props)
    const { quickClass, showMore, onMouseEnter } = useClass()
    const { pagers, onPagerClick } = usePager({
      currentPage,
      pageCount,
      pagerCount,
      showMore,
      disabled,
      emit
    })

    return {
      // state
      pagers,
      showMore,
      quickClass,
      // method
      onMouseEnter,
      onPagerClick
    }
  }
}

const useClass = () => {
  const showMore = reactive({
    left: false,
    right: false
  })
  const quickClass = reactive({
    left: 'el-icon-more',
    right: 'el-icon-more'
  })

  watch(showMore, (v) => {
    for (const vKey in v) {
      if (!v[vKey]) quickClass[vKey] = 'el-icon-more'
    }
  })

  const onMouseEnter = (direction) => {
    quickClass[direction] = `el-icon-d-arrow-${direction}`
  }

  return {
    showMore,
    quickClass,
    onMouseEnter
  }
}

const usePager = ({
  currentPage,
  pageCount,
  pagerCount,
  showMore,
  disabled,
  emit
}) => {
  const pagers = computed(() => {
    const pagerValue = pagerCount.value
    const halfPagerCount = (pagerValue - 1) / 2
    const currentValue = Number(currentPage.value)
    const pageValue = Number(pageCount.value)

    let showPrevMore = false
    let showNextMore = false

    if (pageValue > pagerValue) {
      if (currentValue > pagerValue - halfPagerCount) showPrevMore = true
      if (currentValue < pageValue - halfPagerCount) showNextMore = true
    }

    const array = []

    if (showPrevMore && !showNextMore) {
      const startPage = pageValue - (pagerValue - 2)
      for (let i = startPage; i < pageValue; i++) {
        array.push(i)
      }
    } else if (!showPrevMore && showNextMore) {
      for (let i = 2; i < pagerValue; i++) {
        array.push(i)
      }
    } else if (showPrevMore && showNextMore) {
      const offset = Math.floor(pagerValue / 2) - 1
      for (let i = currentValue - offset; i <= currentValue + offset; i++) {
        array.push(i)
      }
    } else {
      for (let i = 2; i < pageValue; i++) {
        array.push(i)
      }
    }

    showMore.left = showPrevMore
    showMore.right = showNextMore

    return array
  })

  const onPagerClick = (event) => {
    const target = event.target
    if (target.tagName === 'UL' || disabled.value) {
      return
    }

    let newPage = Number(event.target.textContent)
    const pagerCountOffset = pagerCount.value - 2

    if (target.className.indexOf('more') !== -1) {
      if (target.className.indexOf('quickprev') !== -1) {
        newPage = currentPage.value - pagerCountOffset
      } else if (target.className.indexOf('quicknext') !== -1) {
        newPage = +currentPage.value + pagerCountOffset
      }
    }

    /* istanbul ignore if */
    if (!isNaN(newPage)) {
      if (newPage < 1) newPage = 1

      if (newPage > pageCount.value) newPage = pageCount.value
    }
    if (newPage !== currentPage.value) emit('update:currentPage', newPage)
  }

  return {
    pagers,
    onPagerClick
  }
}
</script>
