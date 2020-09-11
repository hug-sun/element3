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
    <slot>
      
    </slot> 
    <!-- <slot name='label'></slot> -->
    
  </div>
</template>
<script>

import {
  ref,
  computed,
  toRefs,
  getCurrentInstance,
  onUpdated,
  onMounted,
  onBeforeUnmount
} from 'vue'
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
    const index = ref(null)
    const loaded = ref(false)
  
    let {parent}=getCurrentInstance();
    console.log(getCurrentInstance());
      onUpdated(()=>{
        parent.emit('tab-nav-update');
     })

    useDispatchFiled(props)

    const isClosable=computed(()=>{
       
       return closable.value || parent.type.props.closable()

    });

    const active=computed(()=>{

      console.log(parent)
      console.log(parent.props.modelValue,index.value);
      const active = parent.props.modelValue === (props.name  ||props.label|| index.value)

      if (active) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        loaded.value = true
      }
      return active
    });

    const  paneName =computed(()=>{
      return props.name || index.value
    });

     return {
       active,
       isClosable,
       paneName,
       index,
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
   dispatch('ElTabs', 'el.tabs.addField', ctx)
  })

  onBeforeUnmount(() => {
    dispatch('ElTabs', 'el.tabs.removeField', ctx)
  })
}

</script>
