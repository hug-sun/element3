<template>
  <span class="el-pagination__jump">
    {{ t('el.pagination.goto') }}
    <el-input
      class="el-pagination__editor is-in-pagination"
      :min="1"
      :max="pageCount"
      :modelValue="showValue"
      type="number"
      :disabled="disabled"
      @input="handleInput"
      @change="handleChange"
    />
    {{ t('el.pagination.pageClassifier') }}
  </span>
</template>

<script>
import ElInput from 'element-ui/packages/input'
import { useLocale } from 'element-ui/src/use/locale'
import { ref, computed, toRefs } from 'vue'

export default {
  name: 'Jumper',
  components: {
    ElInput
  },

  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pageCount: {
      type: Number,
      default: 5
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handleChange: Function
  },

  setup(props) {
    const userInput = ref(null)
    const { disabled, currentPage, pageCount } = toRefs(props)
    const t = useLocale()
    const showValue = computed(() => userInput.value ?? currentPage.value)

    const handleInput = (val) => {
      userInput.value = val
    }
    const handleChange = (val) => {
      props.handleChange?.(val)
      userInput.value = null
    }
    return {
      // state
      disabled,
      showValue,
      pageCount,
      // method
      t,
      handleInput,
      handleChange
    }
  }
}
</script>
