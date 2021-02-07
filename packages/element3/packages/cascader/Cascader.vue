<template>
  <div
    ref="reference"
    :class="[
      'el-cascader',
      realSize && `el-cascader--${realSize}`,
      { 'is-disabled': isDisabled }
    ]"
    v-clickoutside="() => toggleDropDownVisible(false)"
    @mouseenter="inputState.hover = true"
    @mouseleave="inputState.hover = false"
    @click="() => toggleDropDownVisible(readonly ? undefined : true)"
    @keydown="handleKeyDown"
  >
    <el-input
      ref="input"
      v-model="internalValue"
      :size="realSize"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="isDisabled"
      :validate-event="false"
      :class="{ 'is-focus': dropDownVisible }"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
    >
      <template #suffix>
        <i
          v-if="clearBtnVisible"
          class="el-input__icon el-icon-circle-close"
          @click.stop="handleClear"
        ></i>
        <i
          v-else
          :class="[
            'el-input__icon',
            'el-icon-arrow-down',
            dropDownVisible && 'is-reverse'
          ]"
          @click.stop="toggleDropDownVisible(undefined)"
        ></i>
      </template>
    </el-input>

    <div v-if="multiple" class="el-cascader__tags">
      <el-tag
        v-for="(tag, index) in presentState.tags"
        :key="tag.key"
        type="info"
        :size="tagSize"
        :hit="tag.hitState"
        :closable="tag.closable"
        disable-transitions
        @close="deleteTag(index)"
      >
        <span>{{ tag.text }}</span>
      </el-tag>
      <input
        v-if="filterable && !isDisabled"
        v-model.trim="inputState.value"
        type="text"
        class="el-cascader__search-input"
        :placeholder="presentState.tags.length ? '' : placeholder"
        @input="(e) => handleInput(inputState.value, e)"
        @click.stop="toggleDropDownVisible(true)"
        @keydown.delete="handleDelete"
      />
    </div>

    <transition name="el-zoom-in-top" @after-leave="handleDropdownLeave">
      <div
        v-show="dropDownVisible"
        ref="popper"
        :class="['el-popper', 'el-cascader__dropdown', popperClass]"
      >
        <el-cascader-panel
          ref="panel"
          v-show="!filtering"
          v-model="checkedState.value"
          :options="options"
          :props="config"
          :border="false"
          :render-label="$slots.default"
          @expand-change="handleExpandChange"
          @close="toggleDropDownVisible(false)"
          :computePresentText="computePresentText"
        ></el-cascader-panel>
        <el-scrollbar
          ref="suggestionPanel"
          v-if="filterable"
          v-show="filtering"
          tag="ul"
          class="el-cascader__suggestion-panel"
          view-class="el-cascader__suggestion-list"
          @keydown="handleSuggestionKeyDown"
        >
          <template v-if="suggestions.length">
            <li
              v-for="(item, index) in suggestions"
              :key="item.uid"
              :class="[
                'el-cascader__suggestion-item',
                item.checked && 'is-checked'
              ]"
              :tabindex="-1"
              @click="handleSuggestionClick(index)"
            >
              <span>{{ item.text }}</span>
              <i v-if="item.checked" class="el-icon-check"></i>
            </li>
          </template>
          <slot v-else name="empty">
            <li class="el-cascader__empty-text">
              {{ t('el.cascader.noMatch') }}
            </li>
          </slot>
        </el-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  reactive,
  ref,
  toRefs,
  watch,
  onMounted,
  onUnmounted
} from 'vue'
import Popper from '../../src/utils/vue-popper'
import { useEmitter } from '../../src/composables/emitter'
import { migrating } from '../../src/composables/migrating'
import Clickoutside from '../../src/directives/clickoutside'
import { ElInput } from '../../src/components/Input'
import { ElTag } from '../../src/components/Tag'
import ElScrollbar from '../scrollbar'
import ElCascaderPanel from '../cascader-panel'
import AriaUtils from '../../src/utils/aria-utils'
import { t } from '../../src/locale'
import { isEqual, isEmpty, kebabCase } from '../../src/utils/util'
import { isDef } from '../../src/utils/shared'
import { useLocale } from '../../src/composables/locale'
import {
  addResizeListener,
  removeResizeListener
} from '../../src/utils/resize-event'
import { debounce } from 'throttle-debounce'

const { keys: KeyCode } = AriaUtils
const MigratingProps = {
  expandTrigger: {
    newProp: 'expandTrigger',
    type: String
  },
  changeOnSelect: {
    newProp: 'checkStrictly',
    type: Boolean
  },
  hoverThreshold: {
    newProp: 'hoverThreshold',
    type: Number
  }
}

const PopperMixin = {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: Popper.props.arrowOffset,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeUnmount: Popper.beforeUnmount
}

const InputSizeMap = {
  medium: 36,
  small: 32,
  mini: 28
}

export default {
  name: 'ElCascader',

  directives: { Clickoutside },

  components: {
    ElInput,
    ElTag,
    ElScrollbar,
    ElCascaderPanel
  },

  mixins: [PopperMixin],

  emits: [
    'update:modelValue',
    'change',
    'expand-change',
    'active-item-change',
    'visible-change',
    'focus',
    'blur',
    'created',
    'remove-tag'
  ],
  props: {
    modelValue: {},
    options: {
      type: Array,
      default: () => []
    },
    props: Object,
    size: String,
    placeholder: {
      type: String,
      default: () => t('el.cascader.placeholder')
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: Boolean,
    filterable: Boolean,
    filterMethod: {
      type: Function,
      default: undefined
    },
    separator: {
      type: String,
      default: ' / '
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    collapseTags: Boolean,
    debounce: {
      type: Number,
      default: 300
    },
    beforeFilter: {
      type: Function,
      default: () => () => {}
    },
    popperClass: String
  },

  setup(props, { emit, attrs }) {
    const instance = getCurrentInstance()
    const { dispatch } = useEmitter()
    const {
      props: realProps,
      modelValue,
      options,
      filterable,
      size,
      disabled,
      clearable,
      filterMethod,
      showAllLevels,
      separator,
      collapseTags,
      debounce: debounceProp,
      beforeFilter
    } = toRefs(props)
    const t = useLocale()

    migrating({
      'expand-trigger':
        'expand-trigger is removed, use `props.expandTrigger` instead.',
      'change-on-select':
        'change-on-select is removed, use `props.checkStrictly` instead.',
      'hover-threshold':
        'hover-threshold is removed, use `props.hoverThreshold` instead',
      'active-item-change': 'active-item-change is renamed to expand-change'
    })

    const panel = ref(null)
    const input = ref(null)
    const popper = ref(null)
    const suggestionPanel = ref(null)

    const filterHandler = ref(null)
    const filtering = ref(false)
    const pressDeleteCount = ref(0)

    const inputState = reactive({
      hover: false,
      value: null,
      initialHeight: 0
    })
    const checkedState = reactive({
      value: modelValue?.value || null,
      nodes: []
    })

    const elForm = inject('elForm', {})
    const elFormItem = inject('elFormItem', {})

    const isDisabled = computed(() => disabled.value || elForm?.disabled)

    const { dropDownVisible, toggleDropDownVisible } = useDropdownVisible({
      input,
      panel,
      isDisabled,
      emit
    })
    const { config, multiple, leafOnly, readonly, checkStrictly } = useConfig({
      props: realProps,
      attrs,
      filterable
    })
    const {
      presentState,
      computePresentText,
      computePresentContent
    } = usePresent({
      panel,
      checkedState,
      checkStrictly,
      isDisabled,
      leafOnly,
      showAllLevels,
      separator,
      collapseTags,
      multiple
    })
    const {
      suggestions,
      getSuggestions,
      handleSuggestionClick
    } = useSuggestion({
      panel,
      inputState,
      presentState,
      checkedState,
      filterMethod,
      filtering,
      multiple,
      leafOnly,
      showAllLevels,
      separator,
      toggleDropDownVisible
    })
    const { realSize, tagSize } = useSize({ size, elFormItem })

    const internalValue = computed({
      get() {
        return multiple?.value ? presentState.text : inputState.value
      },
      set(v) {
        multiple?.value ? (presentState.text = v) : (inputState.value = v)
      }
    })
    const clearBtnVisible = computed(() => {
      if (
        !clearable.value ||
        isDisabled.value ||
        filtering.value ||
        !inputState.hover
      ) {
        return false
      }

      return multiple?.value
        ? !!checkedState.nodes.filter((node) => !node.isDisabled).length
        : !!presentState.text
    })

    const handleFocus = (e) => {
      emit('focus', e)
    }
    const handleBlur = (e) => {
      emit('blur', e)
    }
    const focusFirstNode = () => {
      nextTick(() => {
        let firstNode = null

        if (filtering.value && suggestionPanel.value) {
          firstNode = suggestionPanel.value.$el.querySelector(
            '.el-cascader__suggestion-item'
          )
        } else {
          const firstMenu = popper.value.querySelector('.el-cascader-menu')
          firstNode = firstMenu.querySelector(
            '.el-cascader-node[tabindex="-1"]'
          )
        }

        if (firstNode) {
          firstNode.focus()
          !filtering.value && firstNode.click()
        }
      })
    }
    const handleInput = (val, event) => {
      !dropDownVisible.value && toggleDropDownVisible(true)

      if (event && event.isComposing) return
      if (val) {
        filterHandler.value?.()
      } else {
        filtering.value = false
      }
    }
    const handleDropdownLeave = () => {
      filtering.value = false
      inputState.value = presentState.text
    }
    const handleClear = () => {
      presentState.text = ''
      panel.value.clearCheckedNodes()
    }
    const handleDelete = () => {
      const lastIndex = presentState.tags.length - 1
      const lastTag = presentState.tags[lastIndex]
      pressDeleteCount.value = inputState.value ? 0 : pressDeleteCount.value++

      if (!lastTag) return

      if (pressDeleteCount.value) {
        if (lastTag.hitState) {
          deleteTag(lastIndex)
        } else {
          lastTag.hitState = true
        }
      }
    }
    const handleExpandChange = (value) => {
      nextTick(instance.proxy.updatePopper.bind(instance.proxy))
      emit('expand-change', value)
      emit('active-item-change', value)
    }
    const handleKeyDown = (event) => {
      switch (event.keyCode) {
        case KeyCode.enter:
          toggleDropDownVisible()
          break
        case KeyCode.down:
          toggleDropDownVisible(true)
          focusFirstNode()
          event.preventDefault()
          break
        case KeyCode.esc:
        case KeyCode.tab:
          toggleDropDownVisible(false)
          break
      }
    }
    const handleSuggestionKeyDown = (event) => {
      const { keyCode, target } = event
      const prev = target.previousElementSibling
      const next = target.nextElementSibling
      switch (keyCode) {
        case KeyCode.enter:
          target.click()
          break
        case KeyCode.up:
          prev && prev.focus()
          break
        case KeyCode.down:
          next && next.focus()
          break
        case KeyCode.esc:
        case KeyCode.tab:
          toggleDropDownVisible(false)
          break
      }
    }
    const updateStyle = () => {
      const { $el } = instance.proxy
      if (!$el) return

      const inputInner = $el.querySelector('.el-input__inner')

      if (!inputInner) return

      const tags = $el.querySelector('.el-cascader__tags')
      let suggestionPanelEl = null

      if (
        suggestionPanel.value &&
        (suggestionPanelEl = suggestionPanel.value.$el)
      ) {
        const suggestionList = suggestionPanelEl.querySelector(
          '.el-cascader__suggestion-list'
        )
        suggestionList.style.minWidth = inputInner.offsetWidth + 'px'
      }

      if (tags) {
        nextTick(() => {
          const { offsetHeight } = tags
          inputInner.style.height =
            Math.max(offsetHeight + 6, inputState.initialHeight) + 'px'
          instance.proxy.updatePopper()
        })
      }
    }
    const deleteTag = (index) => {
      const val = checkedState.value[index]
      checkedState.value = checkedState.value.filter((item, i) => i !== index)
      emit('remove-tag', val)
    }

    onMounted(() => {
      if (input?.value?.$el) {
        inputState.initialHeight =
          input.value.$el.offsetHeight || InputSizeMap[realSize.value] || 40
      }

      if (!isEmpty(modelValue?.value)) {
        computePresentContent()
      }

      filterHandler.value = debounce(debounceProp, () => {
        if (!inputState.value) {
          filtering.value = false
          return
        }

        const before = beforeFilter.value(inputState.value)

        if (before?.then) {
          before.then(getSuggestions)
        } else if (before !== false) {
          getSuggestions()
        } else {
          filtering.value = false
        }
      })

      addResizeListener(instance.proxy.$el, updateStyle)
    })
    onUnmounted(() => {
      removeResizeListener(instance.proxy.$el, updateStyle)
    })

    watch(disabled, () => {
      computePresentContent()
    })
    if (modelValue) {
      watch(modelValue, (val) => {
        if (!isEqual(val, checkedState.value)) {
          checkedState.value = val
          computePresentContent()
        }
      })
    }
    watch(
      () => checkedState.value,
      (val) => {
        if (!isEqual(val, modelValue?.value) || modelValue?.value === void 0) {
          computePresentContent()
          // hide dropdown when single mode
          if (
            !multiple?.value &&
            !checkStrictly.value &&
            dropDownVisible.value
          ) {
            toggleDropDownVisible(false)
          }

          emit('update:modelValue', val)
          emit('change', val)
          dispatch('ElFormItem', 'el.form.change', [val])
        }
      }
    )
    watch(
      options,
      () => {
        nextTick(computePresentContent)
      },
      {
        deep: true
      }
    )
    watch(presentState, (value) => {
      inputState.value = value.text
      if (multiple?.value && (value.tags.length || presentState.tags.length)) {
        nextTick(updateStyle)
      }
    })
    watch(filtering, () => {
      nextTick(instance.proxy.updatePopper)
    })

    return {
      // state
      // ref
      panel,
      input,
      popper,
      suggestionPanel,
      // data
      inputState,
      checkedState,
      presentState,
      suggestions,
      filtering,
      dropDownVisible,
      // computed
      internalValue,
      clearBtnVisible,
      config,
      multiple,
      readonly,
      isDisabled,
      realSize,
      tagSize,
      // methods
      t,
      deleteTag,
      handleFocus,
      handleBlur,
      handleInput,
      handleDropdownLeave,
      handleClear,
      handleDelete,
      handleExpandChange,
      handleKeyDown,
      handleSuggestionKeyDown,
      handleSuggestionClick,
      computePresentText,
      toggleDropDownVisible,
      getCheckedNodes(leafOnly) {
        return panel?.value?.getCheckedNodes(leafOnly)
      }
    }
  }
}

const useSize = ({ size, elFormItem }) => {
  const { proxy } = getCurrentInstance()
  const realSize = computed(() => {
    const _elFormItemSize = elFormItem?.elFormItemSize
    return size?.value || _elFormItemSize || proxy.$ELEMENT?.size
  })
  const tagSize = computed(() => {
    return ['small', 'mini'].indexOf(realSize.value) > -1 ? 'mini' : 'small'
  })

  return {
    realSize,
    tagSize
  }
}

const useConfig = ({ props, attrs, filterable }) => {
  const config = computed(() => {
    const config = props?.value || {}

    Object.keys(MigratingProps).forEach((oldProp) => {
      const { newProp, type } = MigratingProps[oldProp]
      let oldValue = attrs[oldProp] || attrs[kebabCase(oldProp)]
      if (isDef(oldProp) && !isDef(config[newProp])) {
        if (type === Boolean && oldValue === '') {
          oldValue = true
        }
        config[newProp] = oldValue
      }
    })

    return config
  })
  const multiple = computed(() => config.value.multiple)
  const checkStrictly = computed(() => config.value.checkStrictly)
  const leafOnly = computed(() => !checkStrictly.value)
  const readonly = computed(() => !filterable.value || multiple?.value)

  return {
    config,
    checkStrictly,
    multiple,
    leafOnly,
    readonly
  }
}

const useDropdownVisible = ({ input, panel, isDisabled, emit }) => {
  const instance = getCurrentInstance()
  const dropDownVisible = ref(false)

  const toggleDropDownVisible = (visible) => {
    if (isDisabled.value) return

    visible = isDef(visible) ? visible : !dropDownVisible.value
    if (visible !== dropDownVisible.value) {
      dropDownVisible.value = visible
      if (visible) {
        nextTick(() => {
          instance.proxy.updatePopper()
          panel.value.scrollIntoView()
        })
      }
      input?.value.$refs.input.setAttribute('aria-expanded', visible)
      emit('visible-change', visible)
    }
  }

  return {
    dropDownVisible,
    toggleDropDownVisible
  }
}

const useSuggestion = ({
  panel,
  inputState,
  presentState,
  checkedState,
  filterMethod,
  filtering,
  multiple,
  leafOnly,
  showAllLevels,
  separator,
  toggleDropDownVisible
}) => {
  const instance = getCurrentInstance()
  const suggestions = ref([])
  const getSuggestions = () => {
    let internalFilterMethod = filterMethod.value
    if (!(internalFilterMethod instanceof Function)) {
      internalFilterMethod = (node, keyword) => node.text.includes(keyword)
    }

    const internalSuggestions = panel.value
      .getFlattedNodes(leafOnly.value)
      .filter((node) => {
        if (node.isDisabled) return false
        node.text = node.getText(showAllLevels.value, separator.value) || ''
        return internalFilterMethod(node, inputState.value)
      })

    if (multiple) {
      presentState.tags.forEach((tag) => {
        tag.hitState = false
      })
    } else {
      internalSuggestions.forEach((node) => {
        node.checked = isEqual(checkedState.value, node.getValueByOption())
      })
    }

    filtering.value = true
    suggestions.value = internalSuggestions
    nextTick(instance.proxy.updatePopper)
  }
  const handleSuggestionClick = (index) => {
    const targetNode = suggestions.value[index]

    if (multiple?.value) {
      const { checked } = targetNode
      targetNode.doCheck(!checked)
      panel.value.calculateMultiCheckedValue()
    } else {
      checkedState.value = targetNode.getValueByOption()
      toggleDropDownVisible(false)
    }
  }

  return {
    suggestions,
    getSuggestions,
    handleSuggestionClick
  }
}

const usePresent = ({
  panel,
  checkedState,
  checkStrictly,
  isDisabled,
  leafOnly,
  showAllLevels,
  separator,
  collapseTags,
  multiple
}) => {
  const presentState = reactive({
    text: null,
    tags: []
  })

  const computePresentTags = () => {
    const checkedNodes = panel.value.getCheckedNodes(leafOnly.value)
    const tags = []

    const genTag = (node) => ({
      node,
      key: node.uid,
      text: node.getText(showAllLevels.value, separator.value),
      hitState: false,
      closable: !isDisabled.value && !node.isDisabled
    })

    if (checkedNodes.length) {
      const [first, ...rest] = checkedNodes
      const restCount = rest.length
      tags.push(genTag(first))

      if (restCount) {
        if (collapseTags.value) {
          tags.push({
            key: -1,
            text: `+ ${restCount}`,
            closable: false
          })
        } else {
          rest.forEach((node) => tags.push(genTag(node)))
        }
      }
    }

    checkedState.nodes = checkedNodes
    presentState.tags = tags
  }
  const computePresentText = () => {
    if (!isEmpty(checkedState.value)) {
      const node = panel.value.getNodeByValue(checkedState.value)
      if (node && (checkStrictly.value || node.isLeaf)) {
        presentState.text = node.getText(showAllLevels.value, separator.value)
        return
      }
    }
    presentState.text = null
  }
  const computePresentContent = () => {
    // nextTick is required, because checked nodes may not change right now
    nextTick(() => {
      if (multiple?.value) {
        computePresentTags()
        presentState.text = presentState.tags.length ? ' ' : null
      } else {
        computePresentText()
      }
    })
  }

  return {
    presentState,
    computePresentContent,
    computePresentText,
    computePresentTags
  }
}
</script>
