<template>
  <div
    class="el-tabs"
    :class="[
      'el-tabs--' + tabPosition,
      {
        'el-tabs--card': type === 'card',
        'el-tabs--border-card': type === 'border-card'
      }
    ]"
    ref="tabs"
  >
    <div ref="hander" class="el-tabs__header" :class="['is-' + tabPosition]">
      <span
        v-if="addable || editable"
        tabindex="0"
        class="el-tabs__new-tab"
        @click="$emit('edit', null, 'add')"
        ><i class="el-icon-plus"></i
      ></span>
      <div
        class="el-tabs__nav-wrap"
        :class="['is-' + tabPosition, { 'is-scrollable': scrollable }]"
      >
        <span
          v-if="scrollable"
          class="el-tabs__nav-prev"
          @click="handleClickLeft"
          ><i class="el-icon-arrow-left"></i
        ></span>
        <span
          v-if="scrollable"
          class="el-tabs__nav-next"
          @click="handleClickRight"
          ><i class="el-icon-arrow-right"></i
        ></span>
        <div class="el-tabs__nav-scroll" ref="tabScroll">
          <div
            class="el-tabs__nav"
            :class="[
              'is-' + tabPosition,
              {
                'is-stretch':
                  stretch && { top: true, bottom: true }[tabPosition]
              }
            ]"
            ref="tabNav"
          >
            <div
              class="el-tabs__active-bar"
              :class="['is-' + tabPosition]"
              :style="activeBarStyle"
            ></div>
            <div
              v-for="(item, index) in tabList"
              class="el-tabs__item is-closable"
              :class="[
                'is-' + tabPosition,
                {
                  'is-active': index === state.activeIndex,
                  'is-closable': closable || editable || item.closable,
                  'is-disabled': item.disabled
                }
              ]"
              role="tab"
              tabindex="-1"
              :ref="(el) => (tabElList[index] = el)"
              :key="item.name"
              @click="handleClick(item, index, $event)"
            >
              <component
                :is="{
                  render: () => item.pane.slots.label && item.pane.slots.label()
                }"
              ></component>
              {{ item.label }}
              <span
                v-if="closable || editable || item.closable"
                class="el-icon-close"
                @click.stop="handleClose(item, index, $event)"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div ref="content" class="el-tabs__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {
  getCurrentInstance,
  nextTick,
  onMounted,
  onUpdated,
  provide,
  reactive,
  computed,
  ref,
  watch,
  toRefs
} from 'vue'

export default {
  name: 'ElTabs',

  props: {
    modelValue: [String, Number],
    type: { type: String, default: '' },
    closable: Boolean,
    addable: Boolean,
    editable: Boolean,
    tabPosition: { type: String, default: 'top' },
    stretch: Boolean,
    beforeLeave: { type: Function, default: () => () => true }
  },

  emits: ['update:modelValue', 'tab-click', 'tab-remove', 'tab-add', 'edit'],

  setup: function (props) {
    const tabList = reactive([])
    const tabElList = reactive([])

    const {
      scrollable,
      tabs,
      tabScroll,
      tabNav,
      direction,
      scrollToActive,
      handleClickLeft,
      handleClickRight
    } = useTabScroll({
      tabElList
    })

    const { state, handleClick, handleClose } = useTabNav({
      tabElList,
      tabList,
      scrollToActive
    })

    const { activeBarStyle } = useTabBarStyle({ tabList, state, direction })

    provide('elTabsInfo', {
      tabList,
      props,
      state
    })

    return {
      activeBarStyle,
      state,
      tabList,
      tabElList,
      scrollable,
      tabScroll,
      tabNav,
      tabs,
      handleClick,
      handleClose,
      handleClickLeft,
      handleClickRight
    }
  }
}

function useTabBarStyle({ tabList, state, direction }) {
  const activeBarStyle = computed(() => {
    const { sizeName, textSizeName, posName, dirFlag } = direction.value
    return [
      `${sizeName}: ${
        tabList[state.activeIndex] && tabList[state.activeIndex][textSizeName]
      }px`,
      `transform: translate${dirFlag}(${
        tabList[state.activeIndex] && tabList[state.activeIndex][posName]
      }px)`
    ]
  })
  return { activeBarStyle }
}

function useTabNav({ tabList, tabElList, scrollToActive }) {
  const instance = getCurrentInstance()
  const state = reactive({ activeName: '', activeIndex: -1 })

  watch(toRefs(instance.props).modelValue || ref(null), (v) => {
    const tabIndex = tabList.findIndex((item) => item.name === v)
    if (tabIndex === -1) return
    switchTab(tabList[tabIndex], tabIndex)
  })

  onMounted(async () => {
    await nextTick()
    if (!tabList.length) return
    await handleClick(tabList[0], 0)
  })

  onUpdated(async () => {
    await nextTick()
    tabElList.forEach((el, index) => {
      const style = window.getComputedStyle(el)
      tabList[index].width = parseFloat(style.width)
      tabList[index].textWidth =
        parseFloat(style.width) -
        (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight))
      tabList[index].height = parseFloat(style.height)
      tabList[index].textHeight =
        parseFloat(style.height) -
        (parseFloat(style.paddingTop) + parseFloat(style.paddingBottom))
      tabList[index].x =
        parseFloat(style.paddingLeft) + parseFloat(el.offsetLeft)
      tabList[index].y = parseFloat(style.paddingTop) + parseFloat(el.offsetTop)
    })
  })

  const switchTab = async (item, index) => {
    if (index === state.activeIndex) {
      return false
    }
    if (item.disabled) {
      return false
    }
    const isLeave = await instance.props.beforeLeave(
      item.name,
      state.activeName
    )
    if (!isLeave) {
      return false
    }
    item.rendered = true
    state.activeName = item.name
    state.activeIndex = index
    scrollToActive(item)
    return true
  }

  const handleClick = async (item, index, e) => {
    await switchTab(item, index)
    instance.emit('update:modelValue', state.activeName)
    instance.emit('tab-click', tabList[index], e)
  }

  const handleClose = (item, index, e) => {
    tabList.splice(index, 1)
    nextTick(() => {
      tabElList.splice(index, 1)
    })
    instance.emit('tab-remove', item.name, index, item, e)
    instance.emit('edit', item.name, 'remove')
  }

  return {
    state,
    handleClick,
    handleClose
  }
}

function useTabScroll({ tabElList }) {
  const instance = getCurrentInstance()
  const tabs = ref(null)
  const tabScroll = ref(null)
  const tabNav = ref(null)
  const scrollable = ref(false)
  const scrollSize = ref(0)
  const direction = computed(() => {
    const dirFlag = { bottom: true, top: true }[instance.props.tabPosition]
      ? 'X'
      : 'Y'
    const sizeName = { X: 'width', Y: 'height' }[dirFlag]
    const textSizeName = { X: 'textWidth', Y: 'textHeight' }[dirFlag]
    const offsetName = { X: 'offsetWidth', Y: 'offsetHeight' }[dirFlag]
    const scrollName = { X: 'scrollWidth', Y: 'scrollHeight' }[dirFlag]
    const posName = dirFlag.toLocaleLowerCase()

    scrollSize.value = 0

    dirFlag === 'X'
      ? instance.refs.hander &&
        instance.refs.hander.before(instance.refs.content)
      : instance.refs.content &&
        instance.refs.content.before(instance.refs.hander)

    return {
      dirFlag,
      sizeName,
      textSizeName,
      posName,
      offsetName,
      scrollName
    }
  })

  const viewArea = computed(() => {
    const { offsetName } = direction.value
    return {
      start: Math.abs(scrollSize.value),
      end: Math.abs(scrollSize.value) + tabScroll.value[offsetName]
    }
  })

  onUpdated(async () => {
    await nextTick()
    const { sizeName, offsetName } = direction.value
    let sizeSum = 0
    tabElList.forEach((el) => {
      const style = window.getComputedStyle(el)
      sizeSum += parseFloat(style[sizeName])
    })
    scrollable.value = sizeSum > tabScroll.value[offsetName]
  })

  watch(scrollSize, () => {
    const { dirFlag, offsetName } = direction.value
    scrollSize.value = Math.min(scrollSize.value, 0)
    scrollSize.value = Math.max(
      scrollSize.value,
      tabScroll.value[offsetName] - tabNav.value[offsetName]
    )
    tabNav.value.style.transform = `translate${dirFlag}(${scrollSize.value}px)`
  })

  const scrollToActive = (item) => {
    if (!scrollable.value) {
      return
    }
    const { sizeName, posName, offsetName } = direction.value
    scrollSize.value =
      (item[posName] + item[sizeName] / 2) * -1 +
      tabScroll.value[offsetName] / 2
  }

  const handleClickLeft = () => {
    const { offsetName } = direction.value
    scrollSize.value += tabScroll.value[offsetName]
  }
  const handleClickRight = () => {
    const { offsetName } = direction.value
    scrollSize.value -= tabScroll.value[offsetName]
  }
  return {
    viewArea,
    scrollable,
    tabs,
    tabNav,
    tabScroll,
    direction,
    scrollToActive,
    handleClickLeft,
    handleClickRight
  }
}
</script>
