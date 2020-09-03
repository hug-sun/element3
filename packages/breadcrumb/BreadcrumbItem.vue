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
    <span v-else class="el-breadcrumb__separator" role="presentation">
      {{ separator }}
    </span>
  </span>
</template>
<script>
import { inject, ref, onMounted, getCurrentInstance, toRefs } from 'vue'
export default {
  name: 'ElBreadcrumbItem',
  props: {
    to: {},
    replace: Boolean
  },
  setup(props) {
    const { to, replace } = toRefs(props)
    const separator = inject('separator')
    const separatorClass = inject('separatorClass')
    const link = ref(null)
    const { ctx } = getCurrentInstance()
    onMounted(() => {
      link.value.setAttribute('role', 'link')
      link.value.addEventListener('click', () => {
        if (!to || !ctx.$router) return
        replace ? ctx.$router.replace(to) : ctx.$router.push(to)
      })
    })
    return {
      separator,
      separatorClass,
      link,
      to
    }
  }
}
</script>
