<template>
  <div
    class="el-select"
    :class="[selectSize ? 'el-select--' + selectSize : '']"
    @click.stop="toggleMenu"
    v-clickoutside="handleClose"
    @mouseenter.native="inputHovering = true"
    @mouseleave.native="inputHovering = false"
  >
    <div
      class="el-select__tags"
      v-if="multiple"
      ref="tags"
      :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%' }"
    >
      <span v-if="collapseTags && selected.length">
        <el-tag
          :closable="!selectDisabled"
          :size="collapseTagSize"
          :hit="selected[0].hitState"
          type="info"
          @close="deleteTag($event, selected[0])"
          disable-transitions
        >
          <span class="el-select__tags-text">{{
            selected[0].currentLabel
          }}</span>
        </el-tag>
        <el-tag
          v-if="selected.length > 1"
          :closable="false"
          :size="collapseTagSize"
          type="info"
          disable-transitions
        >
          <span class="el-select__tags-text">+ {{ selected.length - 1 }}</span>
        </el-tag>
      </span>
      <transition-group @after-leave="resetInputHeight" v-if="!collapseTags">
        <el-tag
          v-for="item in selected"
          :key="getValueKey(item)"
          :closable="!selectDisabled"
          :size="collapseTagSize"
          :hit="item.hitState"
          type="info"
          @close="deleteTag($event, item)"
          disable-transitions
        >
          <span class="el-select__tags-text">{{ item.currentLabel }}</span>
        </el-tag>
      </transition-group>

      <input
        type="text"
        class="el-select__input"
        :class="[selectSize ? `is-${selectSize}` : '']"
        :disabled="selectDisabled"
        :autocomplete="autoComplete || autocomplete"
        @focus="handleFocus"
        @blur="softFocus = false"
        @keyup="managePlaceholder"
        @keydown="resetInputState"
        @keydown.down.prevent="navigateOptions('next')"
        @keydown.up.prevent="navigateOptions('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        @keydown.tab="visible = false"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition"
        v-model="query"
        @input="debouncedQueryChange"
        v-if="filterable"
        :style="{
          'flex-grow': '1',
          width: inputLength / (inputWidth - 32) + '%',
          'max-width': inputWidth - 42 + 'px'
        }"
        ref="input"
      />
    </div>
    <el-input
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      :id="id"
      :autocomplete="autoComplete || autocomplete"
      :size="selectSize"
      :disabled="selectDisabled"
      :readonly="readonly"
      :validate-event="false"
      :class="{ 'is-focus': visible }"
      :tabindex="multiple && filterable ? '-1' : null"
      @focus="handleFocus"
      @blur="handleBlur"
      @keyup="debouncedOnInputChange"
      @keydown.down.stop.prevent="navigateOptions('next')"
      @keydown.up.stop.prevent="navigateOptions('prev')"
      @keydown.enter.prevent="selectOption"
      @keydown.esc.stop.prevent="visible = false"
      @keydown.tab="visible = false"
      @paste.native="debouncedOnInputChange"
    >
      <template v-slot:prefix v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template v-slot:suffix>
        <i
          v-show="!showClose"
          :class="[
            'el-select__caret',
            'el-input__icon',
            'el-icon-' + iconClass
          ]"
        ></i>
        <i
          v-if="showClose"
          class="el-select__caret el-input__icon el-icon-circle-close"
          @click="handleClearClick"
        ></i>
      </template>
    </el-input>
    <transition
      name="el-zoom-in-top"
      @before-enter="handleMenuEnter"
      @after-leave="doDestroy"
    >
      <el-select-menu
        ref="popper"
        :append-to-body="popperAppendToBody"
        v-show="visible && emptyText !== false"
      >
        <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          ref="scrollbar"
          :class="{
            'is-empty': !allowCreate && query && filteredOptionsCount === 0
          }"
          v-show="options.length > 0 && !loading"
        >
          <el-option :value="query" created v-if="showNewOption"></el-option>
          <slot></slot>
        </el-scrollbar>
        <template
          v-if="
            emptyText &&
            (!allowCreate || loading || (allowCreate && options.length === 0))
          "
        >
          <slot name="empty" v-if="$slots.empty"></slot>
          <p class="el-select-dropdown__empty" v-else>
            {{ emptyText }}
          </p>
        </template>
      </el-select-menu>
    </transition>
  </div>
</template>

<script type="text/babel">
import { useLocale } from 'element-ui/src/use/locale'
import Focus from 'element-ui/src/mixins/focus'
import Locale from 'element-ui/src/mixins/locale'
import ElInput from 'element-ui/packages/input'
import ElSelectMenu from './SelectDropdown'
import ElOption from 'element-ui/packages/option/Option'
import ElTag from 'element-ui/packages/tag'
import ElScrollbar from 'element-ui/packages/scrollbar'
import debounceFn from 'throttle-debounce/debounce'
import Clickoutside from 'element-ui/src/directives/clickoutside'
import {
  addResizeListener,
  removeResizeListener
} from 'element-ui/src/utils/resize-event'
import { t } from 'element-ui/src/locale'
import scrollIntoView from 'element-ui/src/utils/scroll-into-view'
import {
  getValueByPath,
  valueEquals,
  isIE,
  isEdge
} from 'element-ui/src/utils/util'
import NavigationMixin from './navigation-mixin'
import { isKorean } from 'element-ui/src/utils/shared'
import { useEmitter } from 'element-ui/src/use/emitter'
import {
  reactive,
  toRefs,
  provide,
  inject,
  getCurrentInstance,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick
} from 'vue'

export default {
  mixins: [Locale, Focus('reference'), NavigationMixin],

  name: 'ElSelect',

  componentName: 'ElSelect',

  components: {
    ElInput,
    ElSelectMenu,
    ElOption,
    ElTag,
    ElScrollbar
  },

  provide() {
    return {
      select: this
    }
  },

  directives: { Clickoutside },

  props: {
    name: String,
    id: String,
    modelValue: {
      required: true
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      validator(val) {
        process.env.NODE_ENV !== 'production' &&
          console.warn(
            "[Element Warn][Select]'auto-complete' property will be deprecated in next major version. please use 'autocomplete' instead."
          )
        return true
      }
    },
    automaticDropdown: Boolean,
    size: String,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    loading: Boolean,
    popperClass: String,
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    filterMethod: Function,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default() {
        return t('el.select.placeholder')
      }
    },
    defaultFirstOption: Boolean,
    reserveKeyword: Boolean,
    valueKey: {
      type: String,
      default: 'value'
    },
    collapseTags: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    }
  },

  emits: [
    'update:modelValue',
    'input',
    'change',
    'blur',
    'focus',
    'clear',
    'visible-change',
    'remove-tag',
    'setSelected'
  ],

  setup(props, { attrs, emit, slots }) {
    const elForm = inject('elForm', '')
    const elFormItem = inject('elFormItem', '')
    const { ctx } = getCurrentInstance()
    const state = reactive({
      options: [],
      cachedOptions: [],
      createdLabel: null,
      createdSelected: false,
      selected: props.multiple ? [] : {},
      inputLength: 20,
      inputWidth: 0,
      initialInputHeight: 0,
      cachedPlaceHolder: '',
      optionsCount: 0,
      filteredOptionsCount: 0,
      visible: false,
      softFocus: false,
      selectedLabel: '',
      hoverIndex: -1,
      query: '',
      previousQuery: null,
      inputHovering: false,
      currentPlaceholder: '',
      menuVisibleOnFocus: false,
      isOnComposition: false,
      isSilentBlur: false
    })
    const t = useLocale()
    const { dispatch, broadcast, on } = useEmitter()

    // computed
    const _elFormItemSize = computed(() => {
      return (elFormItem || {}).elFormItemSize
    })

    const readonly = computed(() => {
      return (
        !props.filterable ||
        props.multiple ||
        (!isIE() && !isEdge() && !state.visible)
      )
    })

    const selectDisabled = computed(() => {
      return props.disabled || (elForm || {}).disabled
    })

    const showClose = computed(() => {
      const hasValue = props.multiple
        ? Array.isArray(props.modelValue) && props.modelValue.length > 0
        : props.modelValue !== undefined &&
          props.modelValue !== null &&
          props.modelValue !== ''
      const criteria =
        props.clearable &&
        !selectDisabled.value &&
        state.inputHovering &&
        hasValue
      return criteria
    })

    const iconClass = computed(() => {
      return props.remote && props.filterable
        ? ''
        : state.visible
        ? 'arrow-up is-reverse'
        : 'arrow-up'
    })

    const debounce = computed(() => {
      return props.remote ? 300 : 0
    })

    const emptyText = computed(() => {
      if (props.loading) {
        return props.loadingText || t('el.select.loading')
      } else {
        if (props.remote && state.query === '' && state.options.length === 0)
          return false
        if (
          props.filterable &&
          state.query &&
          state.options.length > 0 &&
          state.filteredOptionsCount === 0
        ) {
          return props.noMatchText || t('el.select.noMatch')
        }
        if (state.options.length === 0) {
          return props.noDataText || t('el.select.noData')
        }
      }
      return null
    })

    const showNewOption = computed(() => {
      const hasExistingOption = state.options
        .filter((option) => !option.created)
        .some((option) => option.currentLabel === state.query)
      return (
        props.filterable &&
        props.allowCreate &&
        state.query !== '' &&
        !hasExistingOption
      )
    })

    const selectSize = computed(() => {
      return props.size || _elFormItemSize || (ctx.$ELEMENT || {}).size
    })

    const collapseTagSize = computed(() => {
      return ['small', 'mini'].indexOf(selectSize) > -1 ? 'mini' : 'small'
    })

    // watch
    watch(selectDisabled, () => {
      nextTick(() => {
        resetInputHeight()
      })
    })

    watch(state.placeholder, (val) => {
      state.cachedPlaceHolder = state.currentPlaceholder = val
    })

    watch(props.modelValue, (val, oldVal) => {
      if (props.multiple) {
        resetInputHeight()
        if (
          (val && val.length > 0) ||
          (ctx.$refs.input && state.query !== '')
        ) {
          state.currentPlaceholder = ''
        } else {
          state.currentPlaceholder = state.cachedPlaceHolder
        }
        if (props.filterable && !props.reserveKeyword) {
          state.query = ''
          handleQueryChange(state.query)
        }
      }
      setSelected()
      if (props.filterable && !props.multiple) {
        state.inputLength = 20
      }
      if (!valueEquals(val, oldVal)) {
        dispatch('el.form.change', val)
      }
    })

    watch(state.visible, (val) => {
      if (!val) {
        broadcast('destroyPopper')
        if (ctx.$refs.input) {
          ctx.$refs.input.blur()
        }
        state.query = ''
        state.previousQuery = null
        state.selectedLabel = ''
        state.inputLength = 20
        state.menuVisibleOnFocus = false
        resetHoverIndex()
        nextTick(() => {
          if (
            ctx.$refs.input &&
            ctx.$refs.input.value === '' &&
            state.selected.length === 0
          ) {
            state.currentPlaceholder = state.cachedPlaceHolder
          }
        })
        if (!props.multiple) {
          if (state.selected) {
            if (
              props.filterable &&
              props.allowCreate &&
              state.createdSelected &&
              state.createdLabel
            ) {
              state.selectedLabel = state.createdLabel
            } else {
              state.selectedLabel = state.selected.currentLabel
            }
            if (props.filterable) state.query = state.selectedLabel
          }

          if (props.filterable) {
            state.currentPlaceholder = state.cachedPlaceHolder
          }
        }
      } else {
        broadcast('updatePopper')
        if (props.filterable) {
          state.query = props.remote ? '' : state.selectedLabel
          handleQueryChange(state.query)
          if (props.multiple) {
            ctx.$refs.input.focus()
          } else {
            if (!props.remote) {
              broadcast('queryChange', '')
              broadcast('optionGroup.queryChange')
            }

            if (state.selectedLabel) {
              state.currentPlaceholder = state.selectedLabel
              state.selectedLabel = ''
            }
          }
        }
      }
      emit('visible-change', val)
    })

    watch(state.options, () => {
      if (ctx.$isServer) return
      nextTick(() => {
        broadcast('updatePopper')
      })
      if (props.multiple) {
        resetInputHeight()
      }
      const inputs = ctx.$el.querySelectorAll('input')
      if ([].indexOf.call(inputs, document.activeElement) === -1) {
        setSelected()
      }
      if (
        props.defaultFirstOption &&
        (props.filterable || props.remote) &&
        state.filteredOptionsCount
      ) {
        checkDefaultFirstOption()
      }
    })
    // methods
    const debouncedOnInputChange = debounceFn(debounce, () => {
      onInputChange()
    })

    const debouncedQueryChange = debounceFn(debounce, (e) => {
      handleQueryChange(e.target.value)
    })

    const handleComposition = (event) => {
      const text = event.target.value
      if (event.type === 'compositionend') {
        state.isOnComposition = false
        nextTick((_) => handleQueryChange(text))
      } else {
        const lastCharacter = text[text.length - 1] || ''
        state.isOnComposition = !isKorean(lastCharacter)
      }
    }

    const handleQueryChange = (val) => {
      if (state.previousQuery === val || state.isOnComposition) return
      if (
        state.previousQuery === null &&
        (typeof props.filterMethod === 'function' ||
          typeof props.remoteMethod === 'function')
      ) {
        state.previousQuery = val
        return
      }
      state.previousQuery = val
      nextTick(() => {
        if (state.visible) {
          broadcast('updatePopper')
        }
      })
      state.hoverIndex = -1
      if (props.multiple && props.filterable) {
        nextTick(() => {
          const length = ctx.$refs.input.value.length * 15 + 20
          state.inputLength = props.collapseTags ? Math.min(50, length) : length
          managePlaceholder()
          resetInputHeight()
        })
      }
      if (props.remote && typeof props.remoteMethod === 'function') {
        state.hoverIndex = -1
        props.remoteMethod(val)
      } else if (typeof props.filterMethod === 'function') {
        props.filterMethod(val)
        broadcast('optionGroup.queryChange')
      } else {
        state.filteredOptionsCount = state.optionsCount
        broadcast('queryChange', val)
        broadcast('optionGroup.queryChange')
      }
      if (
        props.defaultFirstOption &&
        (props.filterable || props.remote) &&
        state.filteredOptionsCount
      ) {
        checkDefaultFirstOption()
      }
    }

    const scrollToOption = (option) => {
      const target =
        Array.isArray(option) && option[0] ? option[0].$el : option.$el
      if (ctx.$refs.popper && target) {
        const menu = ctx.$refs.popper.$el.querySelector(
          '.el-select-dropdown__wrap'
        )
        scrollIntoView(menu, target)
      }
      ctx.$refs.scrollbar && ctx.$refs.scrollbar.handleScroll()
    }

    const handleMenuEnter = () => {
      nextTick(() => scrollToOption(state.selected))
    }

    const emitChange = (val) => {
      if (!valueEquals(props.modelValue, val)) {
        emit('change', val)
      }
    }

    const getOption = (value) => {
      let option
      const isObject =
        Object.prototype.toString.call(value).toLowerCase() ===
        '[object object]'
      const isNull =
        Object.prototype.toString.call(value).toLowerCase() === '[object null]'
      const isUndefined =
        Object.prototype.toString.call(value).toLowerCase() ===
        '[object undefined]'

      for (let i = state.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = state.cachedOptions[i]
        const isEqual = isObject
          ? getValueByPath(cachedOption.value, props.valueKey) ===
            getValueByPath(value, props.valueKey)
          : cachedOption.value === value
        if (isEqual) {
          option = cachedOption
          break
        }
      }
      if (option) return option
      const label = !isObject && !isNull && !isUndefined ? value : ''
      const newOption = {
        value: value,
        currentLabel: label
      }
      if (props.multiple) {
        newOption.hitState = false
      }
      return newOption
    }

    const setSelected = () => {
      if (!props.multiple) {
        const option = getOption(props.modelValue)
        if (option.created) {
          state.createdLabel = option.currentLabel
          state.createdSelected = true
        } else {
          state.createdSelected = false
        }
        state.selectedLabel = option.currentLabel
        state.selected = option
        if (props.filterable) state.query = state.selectedLabel
        return
      }
      const result = []
      if (Array.isArray(props.modelValue)) {
        props.modelValue.forEach((value) => {
          result.push(getOption(value))
        })
      }
      state.selected = result
      nextTick(() => {
        resetInputHeight()
      })
    }

    const handleFocus = (event) => {
      if (!state.softFocus) {
        if (props.automaticDropdown || props.filterable) {
          state.visible = true
          if (props.filterable) {
            state.menuVisibleOnFocus = true
          }
        }
        emit('focus', event)
      } else {
        state.softFocus = false
      }
    }

    // const blur = () => {
    //   state.visible = false
    //   ctx.$refs.reference.blur()
    // }

    const handleBlur = (event) => {
      setTimeout(() => {
        if (state.isSilentBlur) {
          state.isSilentBlur = false
        } else {
          emit('blur', event)
        }
      }, 50)
      state.softFocus = false
    }

    const handleClearClick = (event) => {
      deleteSelected(event)
    }

    const doDestroy = () => {
      ctx.$refs.popper && ctx.$refs.popper.doDestroy()
    }

    const handleClose = () => {
      state.visible = false
    }

    const toggleLastOptionHitState = (hit) => {
      if (!Array.isArray(state.selected)) return
      const option = state.selected[state.selected.length - 1]
      if (!option) return

      if (hit === true || hit === false) {
        option.hitState = hit
        return hit
      }

      option.hitState = !option.hitState
      return option.hitState
    }

    const deletePrevTag = (e) => {
      if (e.target.value.length <= 0 && !toggleLastOptionHitState()) {
        const value = props.modelValue.slice()
        value.pop()
        emit('update:modelValue', value)
        emitChange(value)
      }
    }

    const managePlaceholder = () => {
      if (state.currentPlaceholder !== '') {
        state.currentPlaceholder = ctx.$refs.input.value
          ? ''
          : state.cachedPlaceHolder
      }
    }

    const resetInputState = (e) => {
      if (e.keyCode !== 8) toggleLastOptionHitState(false)
      state.inputLength = ctx.$refs.input.value.length * 15 + 20
      resetInputHeight()
    }

    const resetInputHeight = () => {
      if (props.collapseTags && !props.filterable) return
      nextTick(() => {
        if (!ctx.$refs.reference) return
        const inputChildNodes = ctx.$refs.reference.$el.childNodes
        const input = [].filter.call(
          inputChildNodes,
          (item) => item.tagName === 'INPUT'
        )[0]
        const tags = ctx.$refs.tags
        const sizeInMap = state.initialInputHeight || 40
        input.style.height =
          state.selected.length === 0
            ? sizeInMap + 'px'
            : Math.max(
                tags
                  ? tags.clientHeight + (tags.clientHeight > sizeInMap ? 6 : 0)
                  : 0,
                sizeInMap
              ) + 'px'
        if (state.visible && emptyText !== false) {
          broadcast('updatePopper')
        }
      })
    }

    const resetHoverIndex = () => {
      setTimeout(() => {
        if (!props.multiple) {
          state.hoverIndex = state.options.indexOf(state.selected)
        } else {
          if (state.selected.length > 0) {
            state.hoverIndex = Math.min.apply(
              null,
              state.selected.map((item) => state.options.indexOf(item))
            )
          } else {
            state.hoverIndex = -1
          }
        }
      }, 300)
    }

    const handleOptionSelect = ({ option, byClick }) => {
      if (props.multiple) {
        const value = (props.modelValue || []).slice()
        const optionIndex = getValueIndex(value, option.currentValue)
        if (optionIndex > -1) {
          value.splice(optionIndex, 1)
        } else if (
          props.multipleLimit <= 0 ||
          value.length < props.multipleLimit
        ) {
          value.push(option.currentValue)
        }
        emit('update:modelValue', value)
        emitChange(value)
        if (option.created) {
          state.query = ''
          handleQueryChange('')
          state.inputLength = 20
        }
        if (props.filterable) ctx.$refs.input.focus()
      } else {
        emit('update:modelValue', option.currentValue)
        emitChange(option.currentValue)
        state.visible = false
      }
      state.isSilentBlur = byClick
      setSoftFocus()
      if (state.visible) return
      nextTick(() => {
        scrollToOption(option)
      })
    }

    const setSoftFocus = () => {
      state.softFocus = true
      const input = ctx.$refs.input || ctx.$refs.reference
      if (input) {
        input.focus()
      }
    }

    const getValueIndex = (arr = [], value) => {
      const isObject =
        Object.prototype.toString.call(value).toLowerCase() ===
        '[object object]'
      if (!isObject) {
        return arr.indexOf(value)
      } else {
        const valueKey = props.valueKey
        let index = -1
        arr.some((item, i) => {
          if (
            getValueByPath(item, valueKey) === getValueByPath(value, valueKey)
          ) {
            index = i
            return true
          }
          return false
        })
        return index
      }
    }

    const toggleMenu = () => {
      if (!selectDisabled.value) {
        if (state.menuVisibleOnFocus) {
          state.menuVisibleOnFocus = false
        } else {
          state.visible = !state.visible
        }
        if (state.visible) {
          ;(ctx.$refs.input || ctx.$refs.reference).focus()
        }
      }
    }

    const selectOption = () => {
      if (!state.visible) {
        toggleMenu()
      } else {
        if (state.options[state.hoverIndex]) {
          handleOptionSelect({
            option: state.options[state.hoverIndex]
          })
        }
      }
    }

    const deleteSelected = (event) => {
      event.stopPropagation()
      const value = props.multiple ? [] : ''
      emit('update:modelValue', value)
      emitChange(value)
      state.visible = false
      emit('clear')
    }

    const deleteTag = (event, tag) => {
      const index = state.selected.indexOf(tag)
      if (index > -1 && !selectDisabled.value) {
        const value = props.modelValue.slice()
        value.splice(index, 1)
        // emit('input', value)
        emit('update:modelValue', value)
        emitChange(value)
        emit('remove-tag', tag.value)
      }
      event.stopPropagation()
    }

    const onInputChange = () => {
      if (props.filterable && state.query !== state.selectedLabel) {
        state.query = state.selectedLabel
        handleQueryChange(state.query)
      }
    }

    // const onOptionDestroy = (index) => {
    //   if (index > -1) {
    //     state.optionsCount--
    //     state.filteredOptionsCount--
    //     state.options.splice(index, 1)
    //   }
    // }

    const resetInputWidth = () => {
      state.inputWidth = ctx.$refs.reference.$el.getBoundingClientRect().width
    }

    const handleResize = () => {
      resetInputWidth()
      if (props.multiple) resetInputHeight()
    }

    const checkDefaultFirstOption = () => {
      state.hoverIndex = -1
      // highlight the created option
      let hasCreated = false
      for (let i = state.options.length - 1; i >= 0; i--) {
        if (state.options[i].created) {
          hasCreated = true
          state.hoverIndex = i
          break
        }
      }
      if (hasCreated) return
      for (let i = 0; i !== state.options.length; ++i) {
        const option = state.options[i]
        if (state.query) {
          // highlight first options that passes the filter
          if (!option.disabled && !option.groupDisabled && option.visible) {
            state.hoverIndex = i
            break
          }
        } else {
          // highlight currently selected option
          if (option.itemSelected) {
            state.hoverIndex = i
            break
          }
        }
      }
    }

    const getValueKey = (item) => {
      if (
        Object.prototype.toString.call(item.value).toLowerCase() !==
        '[object object]'
      ) {
        return item.value
      } else {
        return getValueByPath(item.value, props.valueKey)
      }
    }

    // beforeCreate
    state.cachedPlaceHolder = state.currentPlaceholder = state.placeholder
    if (props.multiple && !Array.isArray(props.modelValue)) {
      // emit('input', [])
      emit('update:modelValue', [])
    }
    if (!props.multiple && Array.isArray(props.modelValue)) {
      // emit('input', '')
      emit('update:modelValue', '')
    }
    on('handleOptionClick', handleOptionSelect)
    on('setSelected', setSelected)

    // onMounted
    onMounted(() => {
      if (
        props.multiple &&
        Array.isArray(props.modelValue) &&
        props.modelValue.length > 0
      ) {
        state.currentPlaceholder = ''
      }
      addResizeListener(ctx.$el, handleResize)

      const reference = ctx.$refs.reference
      if (reference && reference.$el) {
        const sizeMap = {
          medium: 36,
          small: 32,
          mini: 28
        }
        const input = reference.$el.querySelector('input')
        state.initialInputHeight =
          input.getBoundingClientRect().height || sizeMap[selectSize]
      }
      if (props.remote && props.multiple) {
        resetInputHeight()
      }
      nextTick(() => {
        if (reference && reference.$el) {
          state.inputWidth = reference.$el.getBoundingClientRect().width
        }
      })
      setSelected()
    })
    // onBeforeUnmount
    onBeforeUnmount(() => {
      if (ctx.$el && handleResize) removeResizeListener(ctx.$el, handleResize)
    })
    provide('select', getCurrentInstance())
    return {
      // data
      ...toRefs(state),
      t,
      // computed
      _elFormItemSize,
      readonly,
      selectDisabled,
      showClose,
      iconClass,
      debounce,
      emptyText,
      showNewOption,
      selectSize,
      collapseTagSize,
      // methods
      debouncedOnInputChange,
      debouncedQueryChange,
      handleComposition,
      handleMenuEnter,
      handleFocus,
      handleBlur,
      handleClearClick,
      doDestroy,
      managePlaceholder,
      resetInputState,
      resetInputHeight,
      deletePrevTag,
      setSoftFocus,
      selectOption,
      deleteTag,
      handleClose,
      getValueKey,
      toggleMenu
    }
  }
}
</script>
