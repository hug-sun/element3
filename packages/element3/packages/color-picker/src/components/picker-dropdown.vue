<template>
  <teleport to="body">
    <transition name="el-zoom-in-top" @after-leave-from="doDestroy">
      <div
        class="el-color-dropdown"
        :class="['el-color-picker__panel', popperClass || '']"
        ref="popperElm"
        v-show="showPopper"
      >
        <div class="el-color-dropdown__main-wrapper">
          <hue-slider
            ref="hue"
            :color="color"
            vertical
            style="float: right"
          ></hue-slider>
          <sv-panel ref="sl" :color="color"></sv-panel>
        </div>
        <alpha-slider
          v-if="showAlpha"
          ref="alpha"
          :color="color"
        ></alpha-slider>
        <predefine
          v-if="predefine"
          :color="color"
          :colors="predefine"
        ></predefine>
        <div class="el-color-dropdown__btns">
          <span class="el-color-dropdown__value">
            <el-input
              v-model="customInput"
              @keyup.enter="handleConfirm"
              @blur="handleConfirm"
              :validate-event="false"
              size="mini"
            >
            </el-input>
          </span>
          <el-button
            size="mini"
            type="text"
            class="el-color-dropdown__link-btn"
            @click="$emit('clear')"
          >
            {{ t('el.colorpicker.clear') }}
          </el-button>
          <el-button
            plain
            size="mini"
            class="el-color-dropdown__btn"
            @click="confirmValue"
          >
            {{ t('el.colorpicker.confirm') }}
          </el-button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  provide,
  reactive,
  toRefs,
  watch
} from 'vue'

import { popperProps, usePopper } from '../../../../src/composables/popper.js'
import { useLocale } from '../../../../src/composables/locale.js'
import SvPanel from './sv-panel'
import HueSlider from './hue-slider'
import AlphaSlider from './alpha-slider'
import Predefine from './predefine'
// import Popper from '../../../../src/utils/vue-popper'
// import Locale from '../../../../src/mixins/locale'
import { ElInput } from '../../../../src/components/Input'
import { ElButton } from '../../../../src/components/Button'

export default {
  name: 'el-color-picker-dropdown',

  // mixins: [Popper, Locale],

  components: {
    SvPanel,
    HueSlider,
    AlphaSlider,
    ElInput,
    ElButton,
    Predefine
  },

  emits: ['pick', 'clear', 'update:modelValue', 'created'],
  props: {
    ...popperProps,
    disabled: {
      type: Boolean,
      default: false
    },
    color: {
      required: true
    },
    showAlpha: Boolean,
    predefine: Array,
    popperClass: String
  },

  setup(props, context) {
    const instance = getCurrentInstance()
    const state = reactive({
      customInput: '',
      popperElm: null,
      referenceElm: null,
      alpha: null
    })

    const referenceState = inject('referenceState')
    const popperState = usePopper(props, context, { ...toRefs(state) })
    const currentColor = computed(() => {
      const parent = instance.parent
      return !parent || !parent.proxy.showPanelColor
        ? ''
        : parent.proxy.color.value
    })

    provide('currentColor', currentColor)
    watch(popperState.showPopper, (val) => {
      if (val === true) {
        nextTick(() => {
          const { sl, hue, alpha } = instance.refs
          sl && sl.update()
          hue && hue.update()
          alpha && alpha.update()
        })
      }
    })

    watch(
      currentColor,
      (val) => {
        state.customInput = val
      },
      {
        immediate: true
      }
    )
    onMounted(() => {
      referenceState.popperElm = state.popperElm
      state.referenceElm = referenceState.referenceElm
    })

    function confirmValue() {
      context.emit('pick')
    }

    function handleConfirm() {
      props.color.fromString(state.customInput)
    }
    const t = useLocale()

    return {
      ...popperState,
      ...toRefs(state),
      confirmValue,
      handleConfirm,
      t
    }
  }
}
</script>
