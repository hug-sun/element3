<template>
  <li
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
    class="el-select-dropdown__item"
    v-show="visible"
    :class="{
      selected: itemSelected,
      'is-disabled': disabled || groupDisabled || limitReached,
      hover: hover
    }"
  >
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script type="text/babel">
import { getValueByPath, escapeRegexpString } from '../../src/utils/util'
import { useEmitter } from '../../src/composables/emitter'
import {
  inject,
  getCurrentInstance,
  reactive,
  computed,
  watch,
  toRefs,
  unref,
  onBeforeMount,
  onBeforeUnmount
} from 'vue'

export default {
  name: 'ElOption',

  componentName: 'ElOption',

  props: {
    value: {
      required: true
    },
    label: [String, Number],
    created: Boolean,
    disabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const { on, dispatch } = useEmitter()
    const select = inject('select')
    const { proxy } = getCurrentInstance()
    const { value, label, disabled, created } = toRefs(props)
    const data = reactive({
      index: -1,
      groupDisabled: false,
      visible: true,
      hitState: false,
      hover: false
    })

    const isObject = computed(() => {
      const v = unref(value)
      return (
        Object.prototype.toString.call(v).toLowerCase() === '[object object]'
      )
    })

    const currentLabel = computed(() => {
      return unref(label) || (unref(isObject) ? '' : unref(value))
    })

    const currentValue = computed(() => {
      return unref(value) || label.value || ''
    })

    const itemSelected = computed(() => {
      if (!select.multiple) {
        return isEqual(unref(value), select.modelValue)
      } else {
        return contains(select.modelValue, unref(value))
      }
    })

    const limitReached = computed(() => {
      if (select.multiple) {
        return (
          !unref(itemSelected) &&
          (select.modelValue || []).length >= select.multipleLimit &&
          select.multipleLimit > 0
        )
      } else {
        return false
      }
    })

    function isEqual(a, b) {
      if (!unref(isObject)) {
        return a === b
      } else {
        const valueKey = select.valueKey
        return getValueByPath(a, valueKey) === getValueByPath(b, valueKey)
      }
    }

    function contains(arr = [], target) {
      if (!unref(isObject)) {
        return arr && arr.indexOf(target) > -1
      } else {
        const valueKey = select.valueKey
        return (
          arr &&
          arr.some((item) => {
            return (
              getValueByPath(item, valueKey) ===
              getValueByPath(target, valueKey)
            )
          })
        )
      }
    }

    function handleGroupDisabled(val) {
      data.groupDisabled = val
    }

    function hoverItem() {
      if (!disabled.value && !data.groupDisabled) {
        select.hoverIndex = select.options.indexOf(proxy)
      }
    }

    function selectOptionClick() {
      if (disabled.value !== true && data.groupDisabled !== true) {
        dispatch('handleOptionClick', { option: props, byClick: true })
      }
    }

    function queryChange(query) {
      data.visible =
        new RegExp(escapeRegexpString(query), 'i').test(unref(currentLabel)) ||
        created.value
      if (!data.visible) {
        select.filteredOptionsCount--
      }
    }

    watch(currentLabel, () => {
      if (!created.value && !select.remote) dispatch('setSelected')
    })
    watch(value, (val, oldVal) => {
      const { remote, valueKey } = select
      if (!created.value && !remote) {
        if (
          valueKey &&
          typeof val === 'object' &&
          typeof oldVal === 'object' &&
          val[valueKey] === oldVal[valueKey]
        ) {
          return
        }
        dispatch('setSelected')
      }
    })
    onBeforeMount(() => {
      select.options.push(proxy)
      select.cachedOptions.push(proxy)
      select.optionsCount++
      select.filteredOptionsCount++

      on('queryChange', queryChange)
      on('handleGroupDisabled', handleGroupDisabled)
    })
    onBeforeUnmount(() => {
      const { selected, multiple } = select
      const selectedOptions = multiple ? selected : [selected]
      const index = select.cachedOptions.indexOf(proxy)
      const selectedIndex = selectedOptions.indexOf(proxy)

      // if option is not selected, remove it from cache
      if (index > -1 && selectedIndex < 0) {
        select.cachedOptions.splice(index, 1)
      }
      select.onOptionDestroy(select.options.indexOf(proxy))
    })

    return {
      ...toRefs(data),
      selectOptionClick,
      itemSelected,
      limitReached,
      currentLabel,
      currentValue,
      hoverItem
    }
  }
}
</script>
