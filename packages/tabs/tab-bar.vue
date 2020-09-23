<template>
  <div
    class="el-tabs__active-bar"
    :class="`is-${tabPosition}`"
    :style="barStyle"
  ></div>
</template>
<script>
import { arrayFind } from 'element-ui/src/utils/util'

import { computed, inject, toRefs, ref,getCurrentInstance } from 'vue'

export default {
  name: 'TabBar',

  props: {
    tabs: Array,
    tabPosition:String,
  },

  // inject: ['rootTabs'],
setup(props,ctx){
  console.log(props);
  const {tabs}=toRefs(props);

  const barStyle=useBarStyle(tabs,props.tabPosition);

  // const  tabPosition=ref(getTabPosition());

  return {
      barStyle
    }
}

}

function getTabPosition(){
   const rootTabs =inject('rootTabs',{});

   let tabPosition=rootTabs.type.props.tabPosition
 
   return tabPosition.default
}

const useBarStyle=(tabs,tabPosition)=>{

  //  const tabPosition= getTabPosition()
  
  const barStyle=computed({
    get(){
       const style = {}
        let offset = 0
        let tabSize = 0
      
        const sizeName =
          ['top', 'bottom'].indexOf( tabPosition ) !== -1
            ? 'width'
            : 'height'
        const sizeDir = sizeName === 'width' ? 'x' : 'y'
        const firstUpperCase = (str) => {
          return str
            .toLowerCase()
            .replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
        }
        console.log('into tabs',tabs);
        tabs.value.every((tab, index) => {
          console.log(tab,index)
          let { parent } = getCurrentInstance()
          console.log(parent);
          const $el = arrayFind(
            parent.refs.tabs || [],

            (t) => {
              console.log(t);
              t.id.replace('tab-', '') === tab.paneName
            }
          )
           console.log($el);
          if (!$el) {
            return false
          }
          console.log(tab);
          if (!tab.active) {
            offset += $el[`client${firstUpperCase(sizeName)}`]
            return true
          } else {
        
            tabSize = $el[`client${firstUpperCase(sizeName)}`]
            const tabStyles = window.getComputedStyle($el)
            if (sizeName === 'width' && tabs.value.length > 1) {
              tabSize -=
                parseFloat(tabStyles.paddingLeft) +
                parseFloat(tabStyles.paddingRight)
            }
            if (sizeName === 'width') {
              offset += parseFloat(tabStyles.paddingLeft)
            }
            return false
          }
        })
        console.log(tabSize,sizeName)
        const transform = `translate${firstUpperCase(sizeDir)}(${offset}px)`
        style[sizeName] = tabSize + 'px'
        style.transform = transform
        style.msTransform = transform
        style.webkitTransform = transform

        return style;
    }
  })
  return barStyle;

}
</script>
