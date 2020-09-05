<template>
  <div
    class="el-collapse-item"
    :class="{ 'is-active': isActive, 'is-disabled': disabled }"
  >
    <div
      role="tab"
      :aria-expanded="isActive"
      :aria-controls="`el-collapse-content-${id}`"
      :aria-describedby="`el-collapse-content-${id}`"
    >
      <div
        class="el-collapse-item__header"
        @click="handleHeaderClick"
        role="button"
        :id="`el-collapse-head-${id}`"
        :tabindex="disabled ? undefined : 0"
        @keyup.space.enter.stop="handleEnterClick"
        :class="{
          focusing: focusing,
          'is-active': isActive
        }"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <slot name="title">{{ title }}</slot>
        <i
          class="el-collapse-item__arrow el-icon-arrow-right"
          :class="{ 'is-active': isActive }"
        >
        </i>
      </div>
    </div>
    <el-collapse-transition>
      <div
        class="el-collapse-item__wrap"
        v-show="isActive"
        role="tabpanel"
        :aria-hidden="!isActive"
        :aria-labelledby="`el-collapse-head-${id}`"
        :id="`el-collapse-content-${id}`"
      >
        <div class="el-collapse-item__content">
          <slot></slot>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition'
import { generateId } from 'element-ui/src/utils/util'
import { useEmitter } from 'element-ui/src/use/emitter'
import { reactive, inject, toRefs, computed } from 'vue'

export default {
  name: 'ElCollapseItem',
  componentName: 'ElCollapseItem',
  components: { ElCollapseTransition },
  props: {
    title: String,
    name: {
      type: [String, Number],
      default() {
        return generateId().toString()
      }
    },
    disabled: Boolean
  },
  setup(props) {
    const id = generateId()
    const { dispatch } = useEmitter()

    const state = reactive({
      contentHeight: 0,
      focusing: false,
      isClick: false
    })
    const activeNames = inject('activeNames')
    const isActive = computed(() => {
      return activeNames.value.indexOf(props.name) > -1
    })

    const handleFocus = () => {
      setTimeout(() => {
        if (!state.isClick) {
          state.focusing = true
        } else {
          state.isClick = false
        }
      }, 50)
    }

    const handleHeaderClick = () => {
      if (props.disabled) return
      dispatch('ElCollapse', 'collapse-item-click', props.name)
      state.focusing = false
      state.isClick = true
    }

    const handleEnterClick = () => {
      dispatch('ElCollapse', 'collapse-item-click', props.name)
    }

    return {
      id,
      ...toRefs(state),
      isActive,
      handleFocus,
      handleHeaderClick,
      handleEnterClick
    }
  }
}
</script>
