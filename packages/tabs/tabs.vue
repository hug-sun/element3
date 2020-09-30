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
            @click="handleTabAdd"
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
          :tabPosition='tabPosition'
          :panes="panesArr"
          :stretch="stretch"
          @tab-remove="handleTabRemove"
          @tab-click="handleTabClick"
        ></tab-nav>
      </div>

      <div class="el-tabs__content">
        <slot></slot>
      </div>
    </template>

    <template v-else>
      <!-- [panels, header] -->
      <div class="el-tabs__content"> 
        <slot></slot>
        </div>

      <div :class="['el-tabs__header', `is-${tabPosition}`]">
        <template v-if="editable || addable">
          <span
            class="el-tabs__new-tab"
            @click="handleTabAdd"
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
          :tabPosition='tabPosition'
          :panes="panesArr"
          :stretch="stretch"
           @tab-remove="handleTabRemove"
          @tab-click="handleTabClick"
        ></tab-nav>
      </div>
    </template>
  </div>
</template>
<script>
import TabNav from './tab-nav'
import {
  ref,
  provide,
  watch,
  reactive,
  getCurrentInstance,
  nextTick,
  onMounted,
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
    modelValue: {
      type:String,
      default:null
    },
    closable: Boolean,
    addable: Boolean,
    value: {
        type:String,
      default:null
    },
    editable: Boolean,
    tabPosition: {
      type: String,
      default: 'top'
    },
    beforeLeave: Function,
    stretch: Boolean
  },
  emits: ['tab-click','update:modelValue', 'edit', 'tab-remove', 'tab-add', 'input'],

  setup(props, {  emit, slots }){
 
   
    const currentName = ref(props.value || props.modelValue)
    const {panes} = usePanes();
    const panesArr=panes;
    const instance = getCurrentInstance()
    const { on } = useEmitter()
    const nav=ref(null);

    provide('rootTabs', reactive(instance));

 
   
    watch(()=>props.modelValue, (modelValue) => {
      setCurrentName(modelValue)
    })

    watch(currentName, () => {
      if (nav.value) {
        nextTick(() => {
          // 获取dom 实例
          nav.value.$nextTick(() => {
            nav.value.scrollToActiveTab()
          })
        })
      }
    })
    
    // methods
    const calcPaneInstances=(isForceUpdate = false) =>{
       const slotsDefault = slots.default()
      if (slotsDefault.length) {
       //   
       console.log(isForceUpdate);
      
      } else if (panesArr.value.length !== 0) {
        panesArr.value= []
      }
    }

    const handleTabClick = (data) => {
    
      let {pane, tabName, ev}=data;
      if (pane.disabled) return
      setCurrentName(String(tabName))
      emit('tab-click', pane, ev)
    }

    const handleTabRemove = (data) => {
      let {pane, ev}=data;
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
          emit('update:modelValue', value)
        }

        const beforeLeave = props.beforeLeave
       
        if (currentName.value !== value && beforeLeave) {
          const before = beforeLeave(value, currentName.value)
          if (before && before.then) {
            before.then(
              () => {
                changeCurrentName()
                instance.refs.nav && instance.refs.nav.removeFocus()
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
        setCurrentName('2')
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
      handleTabAdd,
      panes,
      panesArr,
      nav,
      handleKeyDown,
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
