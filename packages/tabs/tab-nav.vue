<template>
 <div
        :class="[
          'el-tabs__nav-wrap',
          scrollable ? 'is-scrollable' : '',
          `is-${tabPosition}`
        ]"
      >
      <template v-if="scrollable">
         <span
            :class="['el-tabs__nav-prev', scrollable.prev ? '' : 'is-disabled']"
            on-click={scrollPrev}
          >
            <i class="el-icon-arrow-left"></i>
          </span>,
          <span
            :class="['el-tabs__nav-next', scrollable.next ? '' : 'is-disabled']"
            on-click={scrollNext}
          >
            <i class="el-icon-arrow-right"></i>
          </span>
      </template>
        <!-- {scrollBtn} -->
        <div class='el-tabs__nav-scroll' ref="navScroll">
          <div
            :class="[
              'el-tabs__nav',
              `is-${tabPosition}`,
              stretch &&
              ['top', 'bottom'].indexOf(tabPosition) !== -1
                ? 'is-stretch'
                : ''
            ]"
            ref="nav"
            style={navStyle}
            role="tablist"
            on-keydown={changeTab}
          >
          <template v-if="!type">
            <tab-bar   :tabPosition="tabPosition" :tabs="panes"></tab-bar>
          </template>
            <template v-for=" (pane,index) in panes" :key="`tab-${pane.name || pane.index || index}`">
              
               <div
              :class="[
               'el-tabs__item',
                `is-${tabPosition }`,
                {'is-active':pane.active},
                {'is-disabled': pane.disabled},
                {'is-closable':  pane.isClosable || editable},
                {'is-focus': isFocus}
              ]"
              :id="`tab-${pane.name || pane.index || index}`"
              :aria-controls="`pane-${pane.name || pane.index || index}`"
              role="tab"
              :aria-selected="pane.active"
             
              :ref="el => { tabs[index] = el }"
              :tabindex="pane.active ? 0 : -1"
              refInFor
              @focus="setFocus"
              @blur ="removeFocus"
              @click="(ev)=>{onTabClick(pane, (pane.name || pane.index || index),ev)}"
              @keydown="(ev)=>{handleKeydown(pane.isClosable || editable,pane,ev)}"
            >
              {{pane.labelContent || pane.label}}
               <template v-if="pane.$slots.label">
                
                 <slot name="label">{pane.$slots.label()}</slot>

                </template>
              <template v-if="pane.isClosable || editable">
                  <span class="el-icon-close" @click="(ev)=>{handleOnClose(pane,ev)}"></span>
              </template>
              <!-- {btnClose} -->
          </div>
            </template>
            <!-- {tabs} -->
          </div>
        </div>
      </div>
  
</template>
<script >
import TabBar from './tab-bar'
import {
  addResizeListener,
  removeResizeListener
} from 'element-ui/src/utils/resize-event'
import { reactive, render,h,ref,toRefs,onUpdated,onMounted,onBeforeUnmount,onBeforeUpdate, computed,getCurrentInstance } from 'vue'

const firstUpperCase = (str) => {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

export default {
  name: 'TabNav',

  components: {
    TabBar
  },

  props: {
    panes:{
        type: Array,
      },
    tabPosition:String,
    currentName: String,
    editable: Boolean,
    type: String,
    stretch: Boolean
  },
  setup(props,{ attrs, emit, slots }){
    
    const {editable,stretch } = toRefs(props)
    const { refs }=getCurrentInstance();
    const $refs=refs;
     const state=reactive({
        scrollable: false,
        navOffset: 0,
        isFocus: false,
        focusable: true

    });
    const tabs=ref([]);

    // make sure to reset the refs before each update
      onBeforeUpdate(() => {
        tabs.value = []
      })

     const navStyle=computed(()=>{

       const dir =['top', 'bottom'].indexOf(props.tabPosition) !== -1 ? 'X' : 'Y'
      return {
        transform: `translate${dir}(-${state.navOffset}px)`
      }

     });

    const sizeName=computed(()=>{

         return ['top', 'bottom'].indexOf(props.tabPosition) !== -1
        ? 'width'
        : 'height'
     });

    // methods 

 const scrollPrev=()=> {
      
      const containerSize = $refs.navScroll[
        `offset${firstUpperCase(sizeName.value)}`
      ]
      const currentOffset = state.navOffset

      if (!currentOffset) return

      const newOffset =
        currentOffset > containerSize ? currentOffset - containerSize : 0

      state.navOffset = newOffset
    }

 
 const scrollNext=()=>{
 
      

      const navSize = refs.nav[`offset${firstUpperCase(sizeName.value)}`]
      const containerSize =refs.navScroll[
        `offset${firstUpperCase(sizeName.value)}`
      ]
      const currentOffset = state.navOffset

      if (navSize - currentOffset <= containerSize) return

      const newOffset =
        navSize - currentOffset > containerSize * 2
          ? currentOffset + containerSize
          : navSize - containerSize

      state.navOffset = newOffset
    }

  const scrollToActiveTab=()=> {
     
      const instance =getCurrentInstance();
      if (!state.scrollable) return
      
      const nav = refs.nav
      const activeTab = instance.$el.querySelector('.is-active')
      if (!activeTab) return
      const navScroll = refs.navScroll
      const isHorizontal =
        ['top', 'bottom'].indexOf(props.tabPosition) !== -1
      const activeTabBounding = activeTab.getBoundingClientRect()
      const navScrollBounding = navScroll.getBoundingClientRect()
      const maxOffset = isHorizontal
        ? nav.offsetWidth - navScrollBounding.width
        : nav.offsetHeight - navScrollBounding.height
      const currentOffset = state.navOffset
      let newOffset = currentOffset

      if (isHorizontal) {
        if (activeTabBounding.left < navScrollBounding.left) {
          newOffset =
            currentOffset - (navScrollBounding.left - activeTabBounding.left)
        }
        if (activeTabBounding.right > navScrollBounding.right) {
          newOffset =
            currentOffset + activeTabBounding.right - navScrollBounding.right
        }
      } else {
        if (activeTabBounding.top < navScrollBounding.top) {
          newOffset =
            currentOffset - (navScrollBounding.top - activeTabBounding.top)
        }
        if (activeTabBounding.bottom > navScrollBounding.bottom) {
          newOffset =
            currentOffset +
            (activeTabBounding.bottom - navScrollBounding.bottom)
        }
      }
      newOffset = Math.max(newOffset, 0)
      state.navOffset = Math.min(newOffset, maxOffset)
    }

  const update=()=> {
     
    
    
      if (!refs.nav) return
  
      const navSize = refs.nav[`offset${firstUpperCase(sizeName.value)}`]
      const containerSize =refs.navScroll[
        `offset${firstUpperCase(sizeName.value)}`
      ]
      const currentOffset = state.navOffset

      if (containerSize < navSize) {
        const currentOffset = state.navOffset
        state.scrollable = state.scrollable || {}
        state.scrollable.prev = currentOffset
        state.scrollable.next = currentOffset + containerSize < navSize
        if (navSize - currentOffset < containerSize) {
          state.navOffset = navSize - containerSize
        }
      } else {
        state.scrollable = false
        if (currentOffset > 0) {
          state.navOffset = 0
        }
      }
    }

  const  changeTab=(e)=>{
  
      const keyCode = e.keyCode
      let nextIndex
      let currentIndex, tabList
      if ([37, 38, 39, 40].indexOf(keyCode) !== -1) {
        // 左右上下键更换tab
        tabList = e.currentTarget.querySelectorAll('[role=tab]')
        currentIndex = Array.prototype.indexOf.call(tabList, e.target)
      } else {
        return
      }
      if (keyCode === 37 || keyCode === 38) {
        // left
        if (currentIndex === 0) {
          // first
          nextIndex = tabList.length - 1
        } else {
          nextIndex = currentIndex - 1
        }
      } else {
        // right
        if (currentIndex < tabList.length - 1) {
          // not last
          nextIndex = currentIndex + 1
        } else {
          nextIndex = 0
        }
      }
      tabList[nextIndex].focus() // 改变焦点元素
      tabList[nextIndex].click() // 选中下一个tab
      setFocus()
    }

  const setFocus=()=> {
      if (state.focusable) {
        state.isFocus = true
      }
    }

  const removeFocus=()=>{
      state.isFocus = false
    }
  
  const visibilityChangeHandler=() =>{
      const visibility = document.visibilityState
      if (visibility === 'hidden') {
        state.focusable = false
      } else if (visibility === 'visible') {
        setTimeout(() => {
          state.focusable = true
        }, 50)
      }
    }

  const windowBlurHandler=()=> {
      state.focusable = false
    }

  const windowFocusHandler=()=>{
      setTimeout(() => {
        state.focusable = true
      }, 50)
    }

    onUpdated(()=>{
       props.panes.map((pane, index)=>{
        pane.state.index = `${index}` ;
      });
      update()
    })

    onMounted(()=>{
     

    let { ctx } = getCurrentInstance()

    addResizeListener(ctx.$el, update)
    document.addEventListener('visibilitychange', visibilityChangeHandler)
    window.addEventListener('blur', windowBlurHandler)
    window.addEventListener('focus', windowFocusHandler)
    setTimeout(() => {
      scrollToActiveTab()
    }, 0)

    });

    onBeforeUnmount(()=>{
       let { ctx } = getCurrentInstance()
          if (ctx.$el && update) removeResizeListener(ctx.$el, update)
        document.removeEventListener(
          'visibilitychange',
          visibilityChangeHandler
        )
        window.removeEventListener('blur', windowBlurHandler)
        window.removeEventListener('focus', windowFocusHandler)
    });

    const onTabClick=(pane, tabName, ev)=>{
    
      removeFocus();
      let data={pane, tabName, ev}
 
      emit('TabClick',data);
    }

    const handleKeydown=(closable,pane,ev)=>{

      if (closable && (ev.keyCode === 46 || ev.keyCode === 8)){
        onTabRemove(pane, ev);
      }
    }
    const onTabRemove=(pane, ev)=>{
    
       let data={pane, ev}
   
      emit('TabRemove',data);
    }
    const handleOnClose=(pane,ev)=>{
      onTabRemove(pane, ev);
    }
   
    

    return {
      ...toRefs(state),
      tabs,
      setFocus,
      removeFocus,
      onTabClick,
      handleOnClose,
      handleKeydown,
      scrollToActiveTab,
      
      

    }
  }


 
}



</script>
