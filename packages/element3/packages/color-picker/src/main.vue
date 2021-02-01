<template>
  <div
    :class="[
      'el-color-picker',
      colorDisabled ? 'is-disabled' : '',
      colorSize ? `el-color-picker--${colorSize}` : ''
    ]"
    ref="referenceElm"
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
      :popperClass="popperClass"
      v-model="showPicker"
      @pick="confirmValue"
      @clear="clearValue"
      :color="color"
      :show-alpha="showAlpha"
      :predefine="predefine"
    >
    </picker-dropdown>
  </div>
</template>

<script>
import {
  reactive,
  inject,
  toRefs,
  onMounted,
  computed,
  watch,
  nextTick,
  provide
} from 'vue'

import Color from './color'
import PickerDropdown from './components/picker-dropdown.vue'
import Clickoutside from '../../../src/directives/clickoutside'
import { useEmitter } from '../../../src/composables/emitter'

export default {
  name: 'ElColorPicker',

  props: {
    modelValue: String,
    showAlpha: Boolean,
    colorFormat: String,
    disabled: Boolean,
    size: String,
    popperClass: String,
    predefine: Array
  },
  emits: ['active-change', 'input', 'change', 'update:modelValue'],
  setup(props, context) {
    const color = new Color({
      enableAlpha: props.showAlpha,
      format: props.colorFormat
    })
    const state = reactive({
      color,
      showPicker: false,
      showPanelColor: false,
      popperElm: null,
      referenceElm: null
    })

    provide('referenceState', state)

    inject('elForm', {})
    const { dispatch } = useEmitter()
    const elFormItem = inject('elFormItem', {})
    const elForm = inject('elForm', {})

    const displayedColor = computed(() => {
      if (!props.modelValue && !state.showPanelColor) {
        return 'transparent'
      }
      return displayedRgb(state.color, props.showAlpha)
    })

    const _elFormItemSize = computed(() => {
      return (elFormItem || {}).elFormItemSize
    })

    const colorSize = computed(() => {
      return (
        props.size || _elFormItemSize.value || (context.$ELEMENT || {}).size
      )
    })

    const colorDisabled = computed(() => {
      return props.disabled || (elForm || {}).disabled
    })

    watch(
      () => props.modelValue,
      (val) => {
        if (!val) {
          state.showPanelColor = false
        } else if (val && val !== state.color.value) {
          state.color.fromString(val)
        }
      }
    )

    watch(state.color, () => (state.showPanelColor = true), {
      deep: true
    })

    watch(displayedColor, (val) => {
      if (!state.showPicker) return
      const currentValueColor = new Color({
        enableAlpha: props.showAlpha,
        format: props.colorFormat
      })
      if (val !== currentValueColor) {
        context.emit('active-change', val)
      }
    })
    onMounted(() => {
      const value = props.modelValue
      if (value) {
        state.color.fromString(value)
      }
    })

    function displayedRgb(color, showAlpha) {
      if (!(color instanceof Color)) {
        throw Error('color should be instance of Color Class')
      }

      const { r, g, b } = color.toRgb()
      return showAlpha
        ? `rgba(${r}, ${g}, ${b}, ${color.get('alpha') / 100})`
        : `rgb(${r}, ${g}, ${b})`
    }
    const handleTrigger = () => {
      if (colorDisabled.value) return
      state.showPicker = !state.showPicker
    }

    const confirmValue = () => {
      const value = state.color.value
      context.emit('update:modelValue', value)
      context.emit('change', value)
      dispatch('ElFormItem', 'el.form.change', value)
      state.showPicker = false
    }

    const clearValue = () => {
      context.emit('update:modelValue', null)
      context.emit('change', null)
      if (props.modelValue !== null) {
        dispatch('ElFormItem', 'el.form.change', null)
      }
      state.showPanelColor = false
      state.showPicker = false
      resetColor()
    }

    const hide = () => {
      state.showPicker = false
      resetColor()
    }
    const resetColor = () => {
      nextTick(() => {
        if (props.modelValue) {
          state.color.fromString(props.modelValue)
        } else {
          state.showPanelColor = false
        }
      })
    }
    return {
      ...toRefs(state),
      handleTrigger,
      confirmValue,
      clearValue,
      hide,
      displayedRgb,
      colorSize,
      colorDisabled,
      displayedColor
    }
  },

  directives: { Clickoutside },

  components: {
    PickerDropdown
  }
}
</script>
