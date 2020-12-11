<template>
  <div
    ref="root"
    class="el-breadcrumb"
    aria-label="Breadcrumb"
    role="navigation"
  >
    <slot></slot>
  </div>
</template>
<script>
import { ref, onMounted, provide, toRefs } from 'vue'
export default {
  name: 'ElBreadcrumb',
  props: {
    separator: {
      type: String,
      default: '/'
    },
    separatorClass: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { separator, separatorClass } = toRefs(props)
    const root = ref(null)
    provide('separator', separator)
    provide('separatorClass', separatorClass)
    onMounted(() => {
      const items = root.value.querySelectorAll('.el-breadcrumb__item')
      if (items.length) {
        items[items.length - 1].setAttribute('aria-current', 'page')
      }
    })
    return {
      root
    }
  }
}
</script>
