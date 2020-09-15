<template>
  <div
    class="el-tab-pane"
    v-if="!lazy || loaded || active"
    v-show="active"
    role="tabpanel"
    :aria-hidden="!active"
    :id="`pane-${paneName}`"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot></slot> 
  </div>
</template>
<script>

import{
  ref,
  computed,
  toRefs,
  getCurrentInstance,
  onUpdated,
  onMounted,
  onBeforeUnmount,
  reactive
}from 'vue'
import { useEmitter } from 'element-ui/src/use/emitter'
export default {
  name: 'ElTabPane',

  componentName: 'ElTabPane',

  props: {
    label: String,
    labelContent: Function,
    name: String,
    closable: Boolean,
    disabled: Boolean,
    lazy: Boolean
  },
   emits:['tab-nav-update'],

  setup(props,ctx){
   
    const { label, labelContent, closable,disabled,lazy } = toRefs(props)
    const state = reactive({
      index:null
    })
    const loaded = ref(false)
  
    let {parent}=getCurrentInstance();
     console.log(parent);
      onUpdated(()=>{
        parent.emit('tab-nav-update');
     })

    useDispatchFiled(props)

    const isClosable=computed(()=>{
       
       return closable.value || parent.props.closable

    });

    const active=computed(()=>{

      const active = parent.proxy.currentName === (props.name || state.index)
  
      if (active) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        loaded.value = true
      }
      return active
    });

    const  paneName =computed(()=>{
      console.log(props.name,state.index)
      return props.name || state.index
    });
     return {
       state,
       active,
       isClosable,
       paneName,
       loaded,
       label, 
       labelContent, 
       closable,
       disabled,
       lazy

     }

  }
  
}

 function useDispatchFiled(props) {
  const { dispatch } = useEmitter()
  const { ctx } = getCurrentInstance()

  onMounted(() => {
   dispatch( 'el.tabs.addField', ctx)
   
  })

  onBeforeUnmount(() => {
    dispatch('el.tabs.removeField', ctx)
  })
}

</script>
