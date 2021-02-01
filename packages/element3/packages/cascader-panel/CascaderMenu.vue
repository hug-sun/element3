<template>
  <el-scrollbar
    tag="ul"
    role="menu"
    :id="menuId"
    class="el-cascader-menu"
    wrap-class="el-cascader-menu__wrap"
    :view-class="{
      'el-cascader-menu__list': true,
      'is-empty': isEmpty
    }"
    @mousemove="handleMouseMove"
  >
    <div v-if="isEmpty" class="el-cascader-menu__empty-text">
      {{ t('el.cascader.noData') }}
    </div>
    <template v-else>
      <cascader-node
        v-for="(node, index) in nodes"
        :key="node.uid"
        :node="node"
        :node-id="`${menuId}-${index}`"
        :aria-haspopup="node.hasChildren"
        :aria-owns="node.hasChildren ? menuId : null"
        @expand="handleExpand"
      ></cascader-node>
      <svg
        v-if="panel.isHoverMenu"
        ref="hoverZone"
        class="el-cascader-menu__hover-zone"
      ></svg>
    </template>
  </el-scrollbar>
</template>

<script>
import { ref, computed, toRefs, inject, getCurrentInstance } from 'vue'
import ElScrollbar from '../scrollbar'
import CascaderNode from './CascaderNode'
import { useLocale } from '../../src/composables/locale'
import { generateId } from '../../src/utils/util'

export default {
  name: 'ElCascaderMenu',

  components: {
    ElScrollbar,
    CascaderNode
  },

  props: {
    nodes: {
      type: Array,
      required: true
    },
    index: Number
  },

  setup(props) {
    const instance = getCurrentInstance()
    const t = useLocale()
    const { index, nodes } = toRefs(props)
    const { proxy } = instance
    const panel = inject('panel')
    const hoverZone = ref(null)
    const data = {
      activeNode: null,
      hoverTimer: null,
      id: generateId()
    }
    const isEmpty = computed(() => !nodes.value.length)
    const menuId = `cascader-menu-${data.id}-${index.value}`

    const clearHoverZone = () => {
      if (!hoverZone.value) return
      hoverZone.value.innerHTML = ''
    }
    const handleExpand = (e) => {
      if (!panel.isHoverMenu) return
      data.activeNode = e.target
    }
    const handleMouseMove = (e) => {
      if (!panel.isHoverMenu) return

      if (!data.activeNode || !hoverZone.value) return

      if (data.activeNode.contains(e.target)) {
        clearTimeout(data.hoverTimer)

        const { left } = proxy.$el.getBoundingClientRect()
        const startX = e.clientX - left
        const { offsetWidth, offsetHeight } = proxy.$el
        const top = data.activeNode.offsetTop
        const bottom = top + data.activeNode.offsetHeight

        hoverZone.value.innerHTML = `
          <path style="pointer-events: auto;" fill="transparent" d="M${startX} ${top} L${offsetWidth} 0 V${top} Z" />
          <path style="pointer-events: auto;" fill="transparent" d="M${startX} ${bottom} L${offsetWidth} ${offsetHeight} V${bottom} Z" />
        `
      } else if (!data.hoverTimer) {
        data.hoverTimer = setTimeout(
          clearHoverZone,
          panel.config.hoverThreshold
        )
      }
    }

    return {
      // state
      data,
      isEmpty,
      menuId,
      hoverZone,
      panel,
      // methods
      t,
      handleExpand,
      handleMouseMove
    }
  }
}
</script>
