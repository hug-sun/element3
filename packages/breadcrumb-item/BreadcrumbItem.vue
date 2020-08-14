<template>
  <span class="el-breadcrumb__item">
    <span
      :class="['el-breadcrumb__inner', to ? 'is-link' : '']"
      ref="link"
      role="link"
    >
      <slot></slot>
    </span>
    <i
      v-if="separatorClass"
      class="el-breadcrumb__separator"
      :class="separatorClass"
    ></i>
    <span v-else class="el-breadcrumb__separator" role="presentation">{{
      separator
    }}</span>
  </span>
</template>
<script>
import { toRefs, onMounted, reactive, inject, getCurrentInstance } from 'vue'
export default {
  name: 'ElBreadcrumbItem',
  props: {
    to: {},
    replace: Boolean
  },
  setup(props, ctx) {
    const { to, replace } = props
    const data = reactive({
      separator: '',
      separatorClass: ''
    })
    const elBreadcrumb = inject('elBreadcrumb', {})
    onMounted(() => {
      data.separator = elBreadcrumb.separator
      data.separatorClass = elBreadcrumb.separatorClass
      const link = getCurrentInstance().proxy.$refs.link
      link.setAttribute('role', 'link')
      link.addEventListener('click', _ => {
        const $router = getCurrentInstance().proxy.$router
        if (!to || !$router) return
        replace ? $router.replace(to) : $router.push(to)
      })
    })
    return { ...toRefs(data), to }
  }
}
</script>
