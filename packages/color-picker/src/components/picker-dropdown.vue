<template>
  <transition name="el-zoom-in-top">
    <div class="el-color-dropdown" v-show="modelValue">
      <div class="el-color-dropdown__main-wrapper">
        <hue-slider
          ref="hue"
          :color="color"
          vertical
          style="float: right"
        ></hue-slider>
        <sv-panel ref="sl" :color="color"></sv-panel>
      </div>
      <alpha-slider v-if="showAlpha" ref="alpha" :color="color"></alpha-slider>
      <predefine
        v-if="predefine"
        :color="color"
        :colors="predefine"
        :currentColor="currentColor"
      ></predefine>
      <div class="el-color-dropdown__btns">
        <span class="el-color-dropdown__value">
          <el-input
            v-model="customInput"
            @keyup.enter="handleConfirm"
            @blur="handleConfirm"
            :validate-event="false"
            size="mini"
          ></el-input>
        </span>
        <el-button
          size="mini"
          type="text"
          class="el-color-dropdown__link-btn"
          @click="$emit('clear')"
          >{{ t('el.colorpicker.clear') }}</el-button
        >
        <el-button
          plain
          size="mini"
          class="el-color-dropdown__btn"
          @click="$emit('pick')"
          >{{ t('el.colorpicker.confirm') }}</el-button
        >
      </div>
    </div>
  </transition>
</template>

<script>
import SvPanel from './sv-panel'
import HueSlider from './hue-slider'
import AlphaSlider from './alpha-slider'
import Predefine from './predefine'

import { t as _t } from 'element-ui/src/locale'

import ElInput from 'element-ui/packages/input'
import ElButton from 'element-ui/packages/button'

import {
  reactive,
  toRefs,
  computed,
  watch,
  onMounted,
  nextTick,
  ref,
  getCurrentInstance
} from 'vue'

export default {
  name: 'el-color-picker-dropdown',

  components: {
    SvPanel,
    HueSlider,
    AlphaSlider,
    ElInput,
    ElButton,
    Predefine
  },

  props: {
    color: {
      required: true
    },
    modelValue: Boolean,
    showAlpha: Boolean,
    predefine: Array
  },

  setup(props) {
    const { color, predefine, showAlpha, modelValue } = toRefs(props)

    const sl = ref(null)
    const hue = ref(null)
    const alpha = ref(null)

    const state = reactive({
      customInput: ''
    })

    const currentColor = computed(() => {
      const {
        proxy: { $parent }
      } = getCurrentInstance()
      return !$parent && !$parent.showPanelColor ? '' : $parent.color.value
    })

    const handleConfirm = () => color.value.fromString(state.customInput)

    const t = (...args) => _t.apply(this, args)

    onMounted(() => {
      const { proxy } = getCurrentInstance()
      const parent = proxy.$parent
      parent.popperElm = proxy.popperElm = proxy.$el
      proxy.referenceElm = parent.$el
    })

    watch(
      () => currentColor,
      (val) => {
        state.customInput = val
      },
      {
        immediate: true
      }
    )

    watch(
      () => modelValue,
      (val) => {
        if (val === true) {
          nextTick(() => {
            sl && sl.value.update()
            hue && hue.value.update()
            alpha && alpha.value.update()
          })
        }
      }
    )

    return {
      ...toRefs(state),
      color,
      currentColor,
      showAlpha,
      predefine,
      modelValue,

      sl,
      hue,
      alpha,

      handleConfirm,
      t
    }
  }
}
</script>
