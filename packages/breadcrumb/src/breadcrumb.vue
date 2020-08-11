<template>
  <div class="el-breadcrumb" aria-label="Breadcrumb" role="navigation">
    <slot></slot>
  </div>
</template>
<script>
import { toRefs, provide, onMounted, getCurrentInstance, reactive } from "vue";
export default {
  name: "ElBreadcrumb",
  provide() {
    return {
      elBreadcrumb: this,
    };
  },
  props: {
    separator: {
      type: String,
      default: "/",
    },
    separatorClass: {
      type: String,
      default: "",
    },
  },
  setup() {
    onMounted(() => {
      const items = getCurrentInstance().proxy.$el.querySelectorAll(
        ".el-breadcrumb__item"
      );
      if (items.length) {
        items[items.length - 1].setAttribute("aria-current", "page");
      }
    });
  },
};
</script>
