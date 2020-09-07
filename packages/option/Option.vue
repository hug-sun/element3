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
import { getValueByPath, escapeRegexpString } from 'element-ui/src/utils/util'
import { useEmitter } from 'element-ui/src/use/emitter'
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
    const { ctx } = getCurrentInstance()
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
      console.log(v.toString())
      console.log(Object.prototype.toString.call(v))
      return (
        Object.prototype.toString.call(v).toLowerCase() === '[object object]'
      )
    })

    const currentLabel = computed(() => {
      return label.value || (isObject ? '' : unref(value))
    })

    const currentValue = computed(() => {
      return unref(value) || label.value || ''
    })

    const itemSelected = computed(() => {
      if (!select.multiple) {
        return isEqual(value, select.modelValue)
      } else {
        return contains(select.modelValue, value)
      }
    })

    const limitReached = computed(() => {
      if (select.multiple) {
        return (
          !itemSelected &&
          (select.modelValue || []).length >= select.multipleLimit &&
          select.multipleLimit > 0
        )
      } else {
        return false
      }
    })

    function isEqual(a, b) {
      a = unref(a)
      b = unref(b)
      if (!isObject) {
        return a === b
      } else {
        const valueKey = select.valueKey
        return getValueByPath(a, valueKey) === getValueByPath(b, valueKey)
      }
    }

    function contains(arr = [], target) {
      arr = unref(arr)
      target = unref(target)
      if (!isObject) {
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
      if (!disabled && !data.groupDisabled) {
        select.hoverIndex = select.options.indexOf(ctx)
      }
    }

    function selectOptionClick() {
      if (disabled !== true && data.groupDisabled !== true) {
        dispatch('ElSelect', 'handleOptionClick', this, true)
      }
    }

    function queryChange(query) {
      data.visible =
        new RegExp(escapeRegexpString(query), 'i').test(currentLabel) || created
      if (!data.visible) {
        select.filteredOptionsCount--
      }
    }

    watch(currentLabel, () => {
      if (!created && !select.remote) dispatch('ElSelect', 'setSelected')
    })
    watch(value, (val, oldVal) => {
      const { remote, valueKey } = select
      if (!created && !remote) {
        if (
          valueKey &&
          typeof val === 'object' &&
          typeof oldVal === 'object' &&
          val[valueKey] === oldVal[valueKey]
        ) {
          return
        }
        dispatch('ElSelect', 'setSelected')
      }
    })
    onBeforeMount(() => {
      select.options.push(ctx)
      select.cachedOptions.push(ctx)
      select.optionsCount++
      select.filteredOptionsCount++

      on('queryChange', queryChange)
      on('handleGroupDisabled', handleGroupDisabled)
    })
    onBeforeUnmount(() => {
      const { selected, multiple } = select
      const selectedOptions = multiple ? selected : [selected]
      const index = select.cachedOptions.indexOf(ctx)
      const selectedIndex = selectedOptions.indexOf(ctx)

      // if option is not selected, remove it from cache
      if (index > -1 && selectedIndex < 0) {
        select.cachedOptions.splice(index, 1)
      }
      select.onOptionDestroy(select.options.indexOf(ctx))
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
