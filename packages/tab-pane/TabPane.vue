<template>
  <div
    v-if="lazy ? tab.rendered : true"
    v-show="
      typeof elTabs.props.modelValue !== 'undefined'
        ? elTabs.ctx.state.activeName === name
        : elTabs.ctx.state.activeIndex === index
    "
  >
    <slot></slot>
  </div>
</template>
<script>
import { getCurrentInstance, inject, ref, reactive } from 'vue'

export default {
  name: 'ElTabPane',

  props: {
    label: [String, Number],
    name: [String, Number],
    disabled: Boolean,
    closable: Boolean,
    lazy: Boolean
  },

  setup(props) {
    const index = ref(0)
    const instance = getCurrentInstance()
    const elTabs = inject('elTabs', null)
    const tab = reactive({
      label: props.label,
      name: props.name,
      disabled: props.disabled,
      closable: props.closable,
      rendered: false,
      pane: instance
    })

    if (!elTabs) {
      console.error('Element: not find parent ETabs')
      return
    }
    index.value = elTabs.ctx.tabList.length
    elTabs.ctx.tabList[index.value] = tab
    return {
      elTabs,
      tab,
      index
    }
  }
}
</script>
