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
import { computed, getCurrentInstance, inject, reactive, toRefs } from 'vue'
import ElCollapseTransition from '../../../src/transitions/collapse-transition'
import { generateId } from '../../../src/utils/util'
import { useEmitter } from '../../../src/composables/emitter'

export default {
  name: 'ElCollapseItem',

  componentName: 'ElCollapseItem',

  components: { ElCollapseTransition },

  props: {
    title: String,
    name: {
      type: [String, Number],
      default() {
        return ''
      }
    },
    disabled: Boolean
  },

  setup(props) {
    const state = reactive({
      contentWrapStyle: {
        height: 'auto',
        display: 'block'
      },
      contentHeight: 0,
      focusing: false,
      isClick: false,
      id: generateId()
    })

    const instance = getCurrentInstance()
    const collapse = inject('collapse')

    const { dispatch } = useEmitter()
    const isActive = computed(() => {
      const name = props.name || props.name === 0 ? props.name : instance.uid
      return collapse.proxy.activeNames.indexOf(name) > -1
    })

    function handleFocus() {
      setTimeout(() => {
        if (!state.isClick) {
          state.focusing = true
        } else {
          state.isClick = false
        }
      }, 50)
    }

    function handleHeaderClick() {
      if (props.disabled) return
      const name = props.name || props.name === 0 ? props.name : instance.uid
      dispatch('item-click', { name })
      state.focusing = false
      state.isClick = true
    }

    function handleEnterClick() {
      const name = props.name || props.name === 0 ? props.name : instance.uid
      dispatch('item-click', { name })
    }
    return {
      ...toRefs(state),
      isActive,
      handleFocus,
      handleHeaderClick,
      handleEnterClick
    }
  }
}
</script>
