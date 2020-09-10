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
          :panes="panesArr"
          :stretch="stretch"
          @TabRemove="handleTabRemove"
          @TabClick="handleTabClick"
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
          :panes="panesArr"
          :stretch="stretch"
          @TabRemove="handleTabRemove"
          @TabClick="handleTabClick"
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
  reactive,
  onUpdated
} from 'vue'

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
    const {  editable, stretch } = toRefs(props)
    const currentName = ref(props.value || props.modelValue)
    
    const {panes} = usePanes();
    const panesArr=panes;
    const instance = getCurrentInstance()
    const { on } = useEmitter()
    const nav=ref(null);
    provide('rootTabs', instance);

 
   
    watch(props.modelValue, (modelValue, prevModelValue) => {
      setCurrentName(modelValue)
    })
    watch(props.value, (value, prevValue) => {

      setCurrentName(value)

    })

    watch(currentName, (currentName, prevCurrentName) => {
      console.log(instance.refs.nav)
      console.log(nav);
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
      if (slotsDefault.length) {
       //   
      
      } else if (panesArr.value.length !== 0) {
        panesArr.value= []
      }
    }

    const handleTabClick = (data) => {
      console.log(data);
      let {pane, tabName, ev}=data;
      if (pane.disabled) return
      setCurrentName(tabName)
      emit('tab-click', pane, ev)
    }

    const handleTabRemove = (data) => {
      let {pane, ev}=data;
      if (pane.disabled) return
      consoe.log(pane);
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
          emit('update:modelValue', value)
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
        setCurrentName('0')
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
      panesArr,
      nav,
      stretch
    }




  }
}

const usePanes = () => {
  const panes = ref([])
  const { on } = useEmitter()

  on('el.tabs.addField', (pane) => {
    if (pane) {
      panes.value.push(pane)
    }
  })

  on('el.tabs.removeField', (pane) => {

   panes.value.splice(panes.value.indexOf(pane), 1)

  })


  return {panes}
}

</script>
