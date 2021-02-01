<template>
  <div class="el-transfer-panel">
    <p class="el-transfer-panel__header">
      <el-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate"
      >
        {{ title }}
        <span>{{ checkedSummary }}</span>
      </el-checkbox>
    </p>

    <div
      :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']"
    >
      <div class="el-transfer-panel__filter">
        <el-input
          v-model="query"
          size="small"
          clearable
          :placeholder="placeholder"
          v-if="filterable"
        >
          <template #prefix>
            <i :class="['el-input__icon', 'el-icon-search']"></i>
          </template>
        </el-input>
      </div>
      <el-checkbox-group
        v-model="checked"
        v-show="!hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="el-transfer-panel__list"
      >
        <el-checkbox
          class="el-transfer-panel__item"
          :label="item[keyProp]"
          :disabled="item[disabledProp]"
          :key="item[keyProp]"
          v-for="item in filteredData"
        >
          <option-content
            :option="item"
            :render-content="renderContent"
            :label-prop="labelProp"
            :key-prop="keyProp"
          />
        </el-checkbox>
      </el-checkbox-group>
      <p class="el-transfer-panel__empty" v-show="hasNoMatch">
        {{ t('el.transfer.noMatch') }}
      </p>
      <p
        class="el-transfer-panel__empty"
        v-show="data.length === 0 && !hasNoMatch"
      >
        {{ t('el.transfer.noData') }}
      </p>
    </div>
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>

<script>
import ElCheckboxGroup from '../../checkbox-group'
import ElCheckbox from '../../checkbox'
import { ElInput } from '../../../src/components/Input'
import OptionContent from './OptionContent.vue'
import { useLocale } from '../../../src/composables/locale'
import { reactive, toRefs, computed, watch } from 'vue'

export default {
  name: 'ElTransferPanel',

  componentName: 'ElTransferPanel',

  emits: ['checked-change'],

  components: {
    ElCheckboxGroup,
    ElCheckbox,
    ElInput,
    OptionContent
  },

  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    renderContent: Function,
    placeholder: String,
    title: String,
    filterable: Boolean,
    format: Object,
    filterMethod: Function,
    defaultChecked: Array,
    props: Object
  },

  setup(props, { emit, slots }) {
    const t = useLocale()

    const state = reactive({
      checked: [],
      allChecked: false,
      query: '',
      checkChangeByUser: true
    })

    const {
      filteredData,
      labelProp,
      keyProp,
      checkableData,
      checkedSummary,
      isIndeterminate,
      hasNoMatch,
      disabledProp,
      hasFooter
    } = useTransferPanelData(props, state, slots, emit)

    const handleAllCheckedChange = (value) => {
      state.checked = value
        ? checkableData.value.map((item) => item[keyProp.value])
        : []
    }

    return {
      t,
      ...toRefs(state),
      filteredData,
      labelProp,
      keyProp,
      checkedSummary,
      isIndeterminate,
      hasNoMatch,
      disabledProp,
      hasFooter,
      handleAllCheckedChange
    }
  }
}

const useTransferPanelData = (props, state, slots, emit) => {
  const filteredData = computed(() => {
    const { data, filterMethod } = props
    return data.filter((item) => {
      if (typeof filterMethod === 'function') {
        return filterMethod(state.query, item)
      } else {
        const label = item[labelProp.value] || item[keyProp.value].toString()
        return label.toLowerCase().indexOf(state.query.toLowerCase()) > -1
      }
    })
  })

  const labelProp = computed(() => {
    const { props: p } = props
    return p.label || 'label'
  })

  const keyProp = computed(() => {
    const { props: p } = props
    return p.key || 'key'
  })

  const checkableData = computed(() =>
    filteredData.value.filter((item) => !item[disabledProp.value])
  )

  const checkedSummary = computed(() => {
    const { data, format } = props
    const checkedLength = state.checked.length
    const dataLength = data.length
    const { noChecked, hasChecked } = format
    if (noChecked && hasChecked) {
      return checkedLength > 0
        ? hasChecked
            .replace(/\${checked}/g, checkedLength)
            .replace(/\${total}/g, dataLength)
        : noChecked.replace(/\${total}/g, dataLength)
    } else {
      return `${checkedLength}/${dataLength}`
    }
  })

  const isIndeterminate = computed(() => {
    const checkedLength = state.checked.length
    return checkedLength > 0 && checkedLength < checkableData.value.length
  })

  const hasNoMatch = computed(
    () => state.query.length > 0 && filteredData.value.length === 0
  )

  const disabledProp = computed(() => props.props.disabled || 'disabled')

  const hasFooter = computed(() => !!slots.default()[0].children.length)

  const updateAllChecked = () => {
    const checkableDataKeys = checkableData.value.map(
      (item) => item[keyProp.value]
    )
    state.allChecked =
      checkableDataKeys.length > 0 &&
      checkableDataKeys.every((item) => state.checked.indexOf(item) > -1)
  }

  watch(
    () => checkableData.value,
    () => updateAllChecked()
  )

  watch(
    () => props.data,
    () => {
      const checked = []
      const filteredDataKeys = filteredData.value.map(
        (item) => item[keyProp.value]
      )
      state.checked.forEach((item) => {
        if (filteredDataKeys.indexOf(item) > -1) {
          checked.push(item)
        }
      })
      state.checkChangeByUser = false
      state.checked = checked
    }
  )

  watch(
    () => state.checked,
    (val, oldVal) => {
      updateAllChecked()
      if (state.checkChangeByUser) {
        const movedKeys = val
          .concat(oldVal)
          .filter((v) => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1)
        emit('checked-change', val, movedKeys)
      } else {
        emit('checked-change', val)
        state.checkChangeByUser = true
      }
    },
    {
      deep: true
    }
  )

  watch(
    () => props.defaultChecked,
    (val, oldVal) => {
      if (
        oldVal &&
        val.length === oldVal.length &&
        val.every((item) => oldVal.indexOf(item) > -1)
      )
        return
      const checked = []
      const checkableDataKeys = checkableData.value.map(
        (item) => item[keyProp.value]
      )
      val.forEach((item) => {
        if (checkableDataKeys.indexOf(item) > -1) {
          checked.push(item)
        }
      })
      state.checkChangeByUser = false
      state.checked = checked
    },
    {
      immediate: true
    }
  )

  return {
    filteredData,
    labelProp,
    keyProp,
    checkableData,
    checkedSummary,
    isIndeterminate,
    hasNoMatch,
    disabledProp,
    hasFooter,
    updateAllChecked
  }
}
</script>
