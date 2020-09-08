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

import {
  ref,
  computed,
  toRefs,
  getCurrentInstance,
  unref,
  onUpdated,
  onMounted
} from 'vue'

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
   
    const { label, labelContent, name, closable,disabled,lazy } = toRefs(props)
    const index = ref(null)
    const loaded = ref(false)
    let {parent}=getCurrentInstance();
   
      onUpdated(()=>{
        parent.emit('tab-nav-update');
     })

    const isClosable=computed(()=>{
       
       return closable.value || parent.type.props.closable()
    });
    
    const active=computed(()=>{
      console.log(parent)
      const active = parent.props.modelValue === (name.value || index.value)
      if (active) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        loaded.value = true
      }
      return active
    });

    const  paneName =computed(()=>{
      return name.value || index.value
    });

     return {
       active,
       isClosable,
       paneName,
       index,
       loaded,
       label, 
       labelContent, 
       name, 
       closable,
       disabled,
       lazy

     }

  }
  
}
</script>
