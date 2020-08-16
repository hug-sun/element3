<template>
  <div
    class="el-switch"
    :class="{ 'is-disabled': switchDisabled, 'is-checked': checked }"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click.prevent="switchValue"
  >
    <input
      class="el-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @keydown.enter="switchValue"
    />
    <span
      :class="['el-switch__label', 'el-switch__label--left', !checked ? 'is-active' : '']"
      v-if="inactiveIconClass || inactiveText"
    >
      <i :class="[inactiveIconClass]" v-if="inactiveIconClass"></i>
      <span v-if="!inactiveIconClass && inactiveText" :aria-hidden="checked">{{ inactiveText }}</span>
    </span>
    <span class="el-switch__core" ref="core" :style="{ 'width': coreWidth + 'px' }"></span>
    <span
      :class="['el-switch__label', 'el-switch__label--right', checked ? 'is-active' : '']"
      v-if="activeIconClass || activeText"
    >
      <i :class="[activeIconClass]" v-if="activeIconClass"></i>
      <span v-if="!activeIconClass && activeText" :aria-hidden="!checked">{{ activeText }}</span>
    </span>
  </div>
</template>
<script>
import {
  toRefs,
  computed,
  nextTick,
  getCurrentInstance,
  onMounted,
  watch
} from 'vue'
import { useEmitter } from 'element-ui/src/use/emitter'
import emitter from 'element-ui/src/mixins/emitter'
import Focus from 'element-ui/src/mixins/focus'
import Migrating from 'element-ui/src/mixins/migrating'

export default {
  name: 'ElSwitch',
  mixins: [Focus('input'), Migrating, emitter],
  inject: {
    elForm: {
      default: ''
    }
  },
  emits: ['onUpdate:modelValue', 'change'],
  props: {
    modelValue: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 40
    },
    activeIconClass: {
      type: String,
      default: ''
    },
    inactiveIconClass: {
      type: String,
      default: ''
    },
    activeText: String,
    inactiveText: String,
    activeColor: {
      type: String,
      default: ''
    },
    inactiveColor: {
      type: String,
      default: ''
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    id: String
  },
  setup(props, { emit }) {
    const {
      width,
      disabled,
      modelValue,
      activeValue,
      inactiveValue,
      activeColor,
      inactiveColor,
      validateEvent
    } = toRefs(props)

    const { ctx } = getCurrentInstance()
    const { dispatch } = useEmitter()
    const switchDisabled = computed(() => {
      // TODO elForm 后面统一搞
      // return this.disabled || (this.elForm || {}).disabled
      return disabled.value
    })

    const checked = computed(() => {
      return modelValue.value === activeValue.value
    })

    const handleChange = (event) => {
      const val = checked.value ? inactiveValue.value : activeValue.value
      emit('update:modelValue', val)
      emit('change', val)
      nextTick(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        ctx.$refs.input.checked = checked.value
      })
    }

    const switchValue = () => {
      if (switchDisabled.value) return
      handleChange()
    }

    const setBackgroundColor = () => {
      let newColor = checked.value ? activeColor : inactiveColor
      ctx.$refs.core.style.borderColor = newColor.value
      ctx.$refs.core.style.backgroundColor = newColor.value
    }

    watch(checked, (value) => {
      ctx.$refs.input.checked = checked.value
      if (activeColor.value || inactiveColor.value) {
        setBackgroundColor()
      }
      if (validateEvent.value) {
        dispatch('ElFormItem', 'el.form.change', modelValue.value)
      }
    })

    onMounted(() => {

      if (!~[activeValue.value, inactiveValue.value].indexOf(modelValue.value)) {
        emit('update:modelValue', inactiveValue.value)
      }

      if (activeColor || inactiveColor) {
        setBackgroundColor()
      }
      ctx.$refs.input.checked = checked.value
    })

    return {
      coreWidth: width,
      checked,
      switchValue,
      switchDisabled
    }
  }
}
</script>