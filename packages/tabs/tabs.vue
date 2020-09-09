<template>
  <div
    :class="[
        'el-tabs',
        `el-tabs--${tabPosition}`,
        { 'el-tabs--card': type === 'card'},
        {'el-tabs--border-card': type === 'border-card'}
        ]"
  >
    <template v-if="tabPosition !== 'bottom'">
      <!-- [header, panels] -->

      <div :class="['el-tabs__header', `is-${tabPosition}`]">
        <template v-if="editable || addable">
          <span
            class="el-tabs__new-tab"
            on-click="{handleTabAdd}"
            tabindex="0"
            @keydown="handleKeyDown"
          >
            <i class="el-icon-plus"></i>
          </span>
        </template>

        <tab-nav
          ref="nav"
          :currentName="currentName"
          :editable="editable"
          :type="type"
          :panes="panes"
          :stretch="stretch"
          :onTabRemove="handleTabRemove"
          :onTabClick="handleTabClick"
        ></tab-nav>
      </div>

      <div class="el-tabs__content">
        <slot></slot>
      </div>
    </template>

    <template v-else>
      <!-- [panels, header] -->
      <div class="el-tabs__content"> <slot></slot></div>

      <div :class="['el-tabs__header', `is-${tabPosition}`]">
        <template v-if="editable || addable">
          <span
            class="el-tabs__new-tab"
            on-click="{handleTabAdd}"
            tabindex="0"
            @keydown="handleKeyDown"
          >
            <i class="el-icon-plus"></i>
          </span>
        </template>

        <tab-nav
          ref="nav"
          :currentName="currentName"
          :editable="editable"
          :type="type"
          :panes="panes"
          :stretch="stretch"
          :onTabRemove="handleTabRemove"
          :onTabClick="handleTabClick"
        ></tab-nav>
      </div>
    </template>
  </div>
</template>
<script>
import TabNav from './tab-nav'
import {
  toRefs,
  ref,
  provide,
  watch,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUpdated
} from 'vue'
import * as Vue from 'vue'
import { useEmitter } from 'element-ui/src/use/emitter'

export default {

  name: 'ElTabs',

  components: {
    TabNav
  },

  props: {
    type: String,
    modelValue: String,
    closable: Boolean,
    addable: Boolean,
    value: {},
    editable: Boolean,
    tabPosition: {
      type: String,
      default: 'top'
    },
    beforeLeave: Function,
    stretch: Boolean
  },
  emits: ['tab-click','update:modelValue', 'edit', 'tab-remove', 'tab-add', 'input'],

  setup(props, { attrs, emit, slots }){
    const { closable, addable, editable, tabPosition, stretch } = toRefs(props)
    const currentName = ref(props.value || props.modelValue)
    const panes = ref([])
    const instance = getCurrentInstance()
    const { on } = useEmitter()
  
    provide('rootTabs', instance);
    
    watch(props.modelValue, (modelValue, prevModelValue) => {
      setCurrentName(value)
    })
    watch(props.value, (value, prevValue) => {
      setCurrentName(value)
    })

    watch(currentName, (currentName, prevCurrentName) => {
      console.log(ctx.refs.nav)
      if (instance.refs.nav) {
        nextTick(() => {
          instance.refs.nav.$nextTick((_) => {
            instance.refs.nav.scrollToActiveTab()
          })
        })
      }
    })

    // methods
    const calcPaneInstances=(isForceUpdate = false) =>{
       const slotsDefault = slots.default()
       console.log(slotsDefault);
      if (slotsDefault) {
         const paneSlots = slotsDefault.filter(
          vnode => vnode.type.componentName === 'ElTabPane'
        )
     
        // update indeed
        const panes = paneSlots.map(
          (item) => getCurrentInstance(item)
        )
        console.log(panes);
        panes.value = paneSlots;
        // const panesChanged = !(
        //   panes.length === this.panes.length &&
        //   panes.every((pane, index) => pane === this.panes[index])
        // )
        // if (isForceUpdate || panesChanged) {
        //   this.panes = panes
        // }
      } else if (this.panes.length !== 0) {
        panes.value = []
      }
    }

    const handleTabClick = (tab, tabName, event) => {
      if (tab.disabled) return
      setCurrentName(tabName)
      emit('tab-click', tab, event)
    }

    const handleTabRemove = (pane, ev) => {
      if (pane.disabled) return
      ev.stopPropagation()
      emit('edit', pane.name, 'remove')
      emit('tab-remove', pane.name)
    }

    const handleTabAdd = () => {
      emit('edit', null, 'add')
      emit('tab-add')
    }

    const setCurrentName = value => {
        const changeCurrentName = () => {
          currentName.value = value
          emit('input', value)
        }

        const beforeLeave = props.beforeLeave
        if (currentName.value !== value && beforeLeave) {
          const before = beforeLeave(value, currentName.value)
          if (before && before.then) {
            before.then(
              () => {
                changeCurrentName()
                ctx.refs.nav && ctx.refs.nav.removeFocus()
              },
              () => {
                // https://github.com/ElemeFE/element/pull/14816
                // ignore promise rejection in `before-leave` hook
              }
            )
          } else if (before !== false) {
            changeCurrentName()
          }
        } else {
          changeCurrentName()
        }
    }

   const handleKeyDown = ev => {
      if (ev.keyCode === 13) {
        handleTabAdd()
      }
    }

   
    onMounted(() => {

      if (!currentName.value) {
        getMatchedCSSRules('0')
      }

      on('tab-nav-update', calcPaneInstances.bind(null, true))
      
      calcPaneInstances()
    })

    onUpdated(() => {
      calcPaneInstances()
    })

    return {
      currentName,
      handleTabClick,
      handleTabRemove,
      editable,
      panes,
      stretch
    }




  },
}
</script>
