<template>
  <div
    :class="[
      'el-color-picker',
      colorDisabled ? 'is-disabled' : '',
      colorSize ? `el-color-picker--${colorSize}` : ''
    ]"
    v-clickoutside="hide"
  >
    <div class="el-color-picker__mask" v-if="colorDisabled"></div>
    <div class="el-color-picker__trigger" @click="handleTrigger">
      <span class="el-color-picker__color" :class="{ 'is-alpha': showAlpha }">
        <span
          class="el-color-picker__color-inner"
          :style="{
            backgroundColor: displayedColor
          }"
        ></span>
        <span
          class="el-color-picker__empty el-icon-close"
          v-if="!modelValue && !showPanelColor"
        ></span>
      </span>
      <span
        class="el-color-picker__icon el-icon-arrow-down"
        v-show="modelValue || showPanelColor"
      ></span>
    </div>
    <picker-dropdown
      ref="dropdown"
      :class="['el-color-picker__panel', popperClass || '']"
      v-model="showPicker"
      @pick="confirmValue"
      @clear="clearValue"
      :color="color"
      :show-alpha="showAlpha"
      :predefine="predefine"
    ></picker-dropdown>
  </div>
</template>

<script>
import Color from './color'
import PickerDropdown from './components/picker-dropdown.vue'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import { useEmitter } from 'element-ui/src/use/emitter'
import {
  toRefs,
  reactive,
  computed,
  nextTick,
  inject,
  getCurrentInstance
} from 'vue'

export default {
  name: 'ElColorPicker',

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    showAlpha: {
      type: Boolean,
      default: false
    },
    colorFormat: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    popperClass: {
      type: String,
      default: ''
    },
    predefine: {
      type: Array,
      default: () => []
    }
  },

  components: {
    PickerDropdown
  },

  directives: { Clickoutside },

  emits: ['input', 'change'],

  setup(props, { emit }) {
    // props
    const { size, modelValue, disabled, showAlpha, colorFormat } = toRefs(props)

    // inject
    const elForm = inject('elForm', '')
    const elFormItem = inject('elFormItem', '')

    // hooks
    const { dispatch } = useEmitter()

    // reactive
    const state = reactive({
      color: new Color({
        enableAlpha: showAlpha.value,
        format: colorFormat.value
      }),
      showPicker: false,
      showPanelColor: false
    })

    // computed
    const colorDisabled = computed(
      () => disabled.value || (elForm || {}).disabled
    )
    const displayedColor = computed(() => {
      if (!modelValue.value && !state.showPanelColor) {
        return 'transparent'
      }

      return displayedRgb(state.color, showAlpha.value)
    })

    const _elFormItemSize = computed(() => (elFormItem || {}).elFormItemSize)

    const colorSize = computed(
      () =>
        size.value ||
        _elFormItemSize.value ||
        (getCurrentInstance().proxy.$ELEMENT || {}).size
    )

    // methods
    const handleTrigger = () => {
      if (colorDisabled.value) return
      state.showPicker = !state.showPicker
    }

    const confirmValue = () => {
      const value = state.color.value
      emit('input', value)
      emit('change', value)
      dispatch('ElFormItem', 'el.form.change', value)
      state.showPicker = false
    }

    const clearValue = () => {
      emit('input', null)
      emit('change', null)
      if (modelValue.value !== null) {
        dispatch('ElFormItem', 'el.form.change', null)
      }
      state.showPanelColor = false
      state.showPicker = false
      resetColor()
    }

    const hide = () => {
      state.showPicker = false
    }

    const resetColor = () => {
      nextTick((_) => {
        if (modelValue.value) {
          state.color.fromString(modelValue.value)
        } else {
          state.showPanelColor = false
        }
      })
    }

    const displayedRgb = (color, showAlpha) => {
      if (!(color instanceof Color)) {
        throw Error('color should be instance of Color Class')
      }

      const { r, g, b } = state.color.toRgb()
      return showAlpha
        ? `rgba(${r}, ${g}, ${b}, ${color.get('alpha') / 100})`
        : `rgb(${r}, ${g}, ${b})`
    }

    return {
      ...toRefs(state),
      colorDisabled,
      modelValue,

      colorSize,
      displayedColor,

      handleTrigger,
      confirmValue,
      clearValue,
      hide,
      displayedRgb
    }
  }
}
</script>
