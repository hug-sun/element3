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
import { ElInput } from '../../../src/components/Input'
import { useLocale } from '../../../src/composables/locale'
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
    }
  },
  emits: ['change'],

  setup(props, { emit }) {
    const userInput = ref(null)
    const { currentPage } = toRefs(props)
    const t = useLocale()
    const showValue = computed(() => userInput.value ?? currentPage.value)

    const handleInput = (val) => {
      userInput.value = val
    }
    const handleChange = (val) => {
      emit('change', val)
      userInput.value = null
    }
    return {
      // state
      showValue,
      // method
      t,
      handleInput,
      handleChange
    }
  }
}
</script>
