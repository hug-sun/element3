<template>
  <span class="el-pagination__jump">
    {{ t('el.pagination.goto') }}
    <el-input
      v-model="model"
      class="el-pagination__editor is-in-pagination"
      :min="1"
      :max="pager.count"
      type="number"
    />
    {{ t('el.pagination.pageClassifier') }}
  </span>
</template>
<script lang="ts">
import { computed } from '@vue/runtime-core'
import { ElInput } from '../../../../components/Input'
import { useLocale } from '../../../../composables/locale'
import { Pager } from '../entity/Pager'

export default {
  props: {
    pager: Pager
  },
  components: { ElInput },
  setup(props) {
    const t = useLocale()
    const model = computed({
      get() {
        return props.pager.current
      },
      set(v: number) {
        props.pager.jump(v)
      }
    })
    return {
      model,
      t
    }
  }
}
</script>
