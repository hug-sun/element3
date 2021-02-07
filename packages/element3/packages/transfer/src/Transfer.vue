<template>
  <div class="el-transfer">
    <transfer-panel
      v-bind="$props"
      ref="leftPanel"
      :data="sourceData"
      :title="leftTransferPanelTitle"
      :default-checked="leftDefaultChecked"
      :placeholder="panelFilterPlaceholder"
      @checked-change="onSourceCheckedChange"
    >
      <template #default>
        <slot name="left-footer"></slot>
      </template>
    </transfer-panel>
    <div class="el-transfer__buttons">
      <el-button
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click="addToLeft"
        :disabled="rightChecked.length === 0"
      >
        <i class="el-icon-arrow-left"></i>
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </el-button>
      <el-button
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click="addToRight"
        :disabled="leftChecked.length === 0"
      >
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>
    <transfer-panel
      v-bind="$props"
      ref="rightPanel"
      :data="targetData"
      :title="rightTransferPanelTitle"
      :default-checked="rightDefaultChecked"
      :placeholder="panelFilterPlaceholder"
      @checked-change="onTargetCheckedChange"
    >
      <template #default>
        <slot name="right-footer"></slot>
      </template>
    </transfer-panel>
  </div>
</template>

<script>
import TransferPanel from './TransferPanel.vue'
import { ElButton } from '../../../src/components/Button'
import { useLocale } from '../../../src/composables/locale'
import { ref, computed, watch, provide } from 'vue'

export default {
  name: 'ElTransfer',

  emits: [
    'update:modelValue',
    'change',
    'left-check-change',
    'right-check-change'
  ],

  components: {
    TransferPanel,
    ElButton
  },

  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    titles: {
      type: Array,
      default() {
        return []
      }
    },
    buttonTexts: {
      type: Array,
      default() {
        return []
      }
    },
    filterPlaceholder: {
      type: String,
      default: ''
    },
    filterMethod: Function,
    leftDefaultChecked: {
      type: Array,
      default() {
        return []
      }
    },
    rightDefaultChecked: {
      type: Array,
      default() {
        return []
      }
    },
    renderContent: Function,
    modelValue: {
      type: Array,
      default() {
        return []
      }
    },
    format: {
      type: Object,
      default() {
        return {}
      }
    },
    filterable: Boolean,
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          key: 'key',
          disabled: 'disabled'
        }
      }
    },
    targetOrder: {
      type: String,
      default: 'original'
    }
  },
  setup(props, { emit, slots }) {
    const t = useLocale()

    const leftChecked = ref([])
    const rightChecked = ref([])

    // $refs
    const leftPanel = ref(null)
    const rightPanel = ref(null)

    const hasButtonTexts = computed(() => props.buttonTexts.length === 2)

    const clearQuery = (which) => {
      if (which === 'left') {
        leftPanel.value.query = ''
      } else if (which === 'right') {
        rightPanel.value.query = ''
      }
    }

    watch(props.modelValue, (val) => emit('update:modelValue', val))

    provide(
      'defaultScopedSlots',
      computed(() => slots.default)
    )

    const {
      leftTransferPanelTitle,
      rightTransferPanelTitle,
      panelFilterPlaceholder,
      sourceData,
      targetData
    } = useTransferData(props, t)

    const {
      onSourceCheckedChange,
      onTargetCheckedChange,
      addToLeft,
      addToRight
    } = useTransferCheckedChange(props, emit, leftChecked, rightChecked)

    return {
      leftChecked,
      rightChecked,
      hasButtonTexts,
      sourceData,
      targetData,
      leftTransferPanelTitle,
      rightTransferPanelTitle,
      panelFilterPlaceholder,
      onSourceCheckedChange,
      onTargetCheckedChange,
      addToLeft,
      addToRight,
      clearQuery
    }
  }
}

const useTransferData = (props, t) => {
  const leftTransferPanelTitle = computed(
    () => props.titles[0] || t('el.transfer.titles.0')
  )

  const rightTransferPanelTitle = computed(
    () => props.titles[1] || t('el.transfer.titles.1')
  )

  const panelFilterPlaceholder = computed(
    () => props.filterPlaceholder || t('el.transfer.filterPlaceholder')
  )

  const dataObj = computed(() => {
    const { props: p, data } = props
    const key = p.key
    return data.reduce((o, cur) => (o[cur[key]] = cur) && o, {})
  })

  const sourceData = computed(() => {
    const { data, modelValue, props: p } = props
    return data.filter((item) => modelValue.indexOf(item[p.key]) === -1)
  })

  const targetData = computed(() => {
    const { data, modelValue, props: p, targetOrder } = props
    if (targetOrder === 'original') {
      return data.filter((item) => modelValue.indexOf(item[p.key]) > -1)
    } else {
      return modelValue.reduce((arr, cur) => {
        const val = dataObj.value[cur]
        if (val) {
          arr.push(val)
        }
        return arr
      }, [])
    }
  })

  return {
    dataObj,
    sourceData,
    targetData,
    leftTransferPanelTitle,
    rightTransferPanelTitle,
    panelFilterPlaceholder
  }
}

const useTransferCheckedChange = (props, emit, leftChecked, rightChecked) => {
  const onSourceCheckedChange = (val, movedKeys) => {
    leftChecked.value = val
    if (movedKeys === undefined) return
    emit('left-check-change', val, movedKeys)
  }

  const onTargetCheckedChange = (val, movedKeys) => {
    rightChecked.value = val
    if (movedKeys === undefined) return
    emit('right-check-change', val, movedKeys)
  }

  const addToLeft = () => {
    const currentValue = props.modelValue.slice()
    rightChecked.value.forEach((item) => {
      const index = currentValue.indexOf(item)
      if (index > -1) {
        currentValue.splice(index, 1)
      }
    })
    emit('update:modelValue', currentValue)
    emit('change', currentValue, 'left', rightChecked.value)
  }

  const addToRight = () => {
    const { modelValue, props: p, data, targetOrder } = props
    let currentValue = modelValue.slice()
    const itemsToBeMoved = []
    const key = p.key
    data.forEach((item) => {
      const itemKey = item[key]
      if (
        leftChecked.value.indexOf(itemKey) > -1 &&
        modelValue.indexOf(itemKey) === -1
      ) {
        itemsToBeMoved.push(itemKey)
      }
    })
    currentValue =
      targetOrder === 'unshift'
        ? itemsToBeMoved.concat(currentValue)
        : currentValue.concat(itemsToBeMoved)
    emit('update:modelValue', currentValue)
    emit('change', currentValue, 'right', leftChecked.value)
  }

  return {
    onSourceCheckedChange,
    onTargetCheckedChange,
    addToLeft,
    addToRight
  }
}
</script>
