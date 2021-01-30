<template>
  <span class="el-pagination__sizes">
    <el-select
      :modelValue="pageSize"
      :popperClass="internalPopperClass"
      size="mini"
      @change="handleChange"
      :disabled="disabled"
    >
      <el-option
        v-for="item in pageSizes"
        :value="item"
        :label="item + t('el.pagination.pagesize')"
        :key="item"
      >
      </el-option>
    </el-select>
  </span>
</template>

<script>
import ElSelect from '../../select'
import ElOption from '../../option'
import { useLocale } from '../../../src/composables/locale'
import { computed, watch, toRefs } from 'vue'

export default {
  name: 'Sizes',

  components: {
    ElSelect,
    ElOption
  },

  props: {
    pageSizes: Array,

    pageSize: Number,

    popperClass: String,

    handleChange: Function,

    disabled: Boolean,

    watchHandler: Function
  },

  setup(props) {
    const { popperClass, pageSizes } = toRefs(props)
    const t = useLocale()
    const internalPopperClass = computed(() => popperClass?.value || '')

    watch(pageSizes, props.watchHandler)

    return {
      // state
      ...toRefs(props),
      internalPopperClass,
      // methods
      t
    }
  }
}
</script>

<style scoped></style>
