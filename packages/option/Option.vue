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

export default {
  name: 'ElOption',

  componentName: 'ElOption',

  inject: ['select'],

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

  setup() {
    const { dispatch } = useEmitter()
    return { dispatch }
  },

  data() {
    return {
      index: -1,
      groupDisabled: false,
      visible: true,
      hitState: false,
      hover: false
    }
  },

  computed: {
    isObject() {
      return (
        Object.prototype.toString.call(this.value).toLowerCase() ===
        '[object object]'
      )
    },

    currentLabel() {
      return this.label || (this.isObject ? '' : this.value)
    },

    currentValue() {
      return this.value || this.label || ''
    },

    itemSelected() {
      if (!this.select.multiple) {
        return this.isEqual(this.value, this.select.modelValue)
      } else {
        return this.contains(this.select.modelValue, this.value)
      }
    },

    limitReached() {
      if (this.select.multiple) {
        return (
          !this.itemSelected &&
          (this.select.modelValue || []).length >= this.select.multipleLimit &&
          this.select.multipleLimit > 0
        )
      } else {
        return false
      }
    }
  },

  watch: {
    currentLabel() {
      if (!this.created && !this.select.remote)
        this.dispatch('ElSelect', 'setSelected')
    },
    value(val, oldVal) {
      const { remote, valueKey } = this.select
      if (!this.created && !remote) {
        if (
          valueKey &&
          typeof val === 'object' &&
          typeof oldVal === 'object' &&
          val[valueKey] === oldVal[valueKey]
        ) {
          return
        }
        this.dispatch('ElSelect', 'setSelected')
      }
    }
  },

  methods: {
    isEqual(a, b) {
      if (!this.isObject) {
        return a === b
      } else {
        const valueKey = this.select.modelValueKey
        return getValueByPath(a, valueKey) === getValueByPath(b, valueKey)
      }
    },

    contains(arr = [], target) {
      if (!this.isObject) {
        return arr && arr.indexOf(target) > -1
      } else {
        const valueKey = this.select.modelValueKey
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
    },

    handleGroupDisabled(val) {
      this.groupDisabled = val
    },

    hoverItem() {
      if (!this.disabled && !this.groupDisabled) {
        this.select.hoverIndex = this.select.options.indexOf(this)
      }
    },

    selectOptionClick() {
      if (this.disabled !== true && this.groupDisabled !== true) {
        this.dispatch('ElSelect', 'handleOptionClick', this, true)
      }
    },

    queryChange(query) {
      this.visible =
        new RegExp(escapeRegexpString(query), 'i').test(this.currentLabel) ||
        this.created
      if (!this.visible) {
        this.select.filteredOptionsCount--
      }
    }
  },

  created() {
    this.select.options.push(this)
    this.select.cachedOptions.push(this)
    this.select.optionsCount++
    this.select.filteredOptionsCount++

    const { on } = useEmitter()
    on('queryChange', this.queryChange)
    on('handleGroupDisabled', this.handleGroupDisabled)
  },

  beforeDestroy() {
    const { selected, multiple } = this.select
    const selectedOptions = multiple ? selected : [selected]
    const index = this.select.cachedOptions.indexOf(this)
    const selectedIndex = selectedOptions.indexOf(this)

    // if option is not selected, remove it from cache
    if (index > -1 && selectedIndex < 0) {
      this.select.cachedOptions.splice(index, 1)
    }
    this.select.onOptionDestroy(this.select.options.indexOf(this))
  }
}
</script>
