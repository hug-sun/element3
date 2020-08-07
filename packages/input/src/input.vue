<template>
  <div
    :class="[
    type === 'textarea' ? 'el-textarea' : 'el-input',
    inputSize ? 'el-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'is-exceed': inputExceed,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend,
      'el-input--prefix': $slots.prefix || prefixIcon,
      'el-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="el-input__inner"
        v-bind="$attrs"
        :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      />
      <!-- 前置内容 -->
      <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="el-input__icon" v-if="prefixIcon" :class="prefixIcon"></i>
      </span>
      <!-- 后置内容 -->
      <span class="el-input__suffix" v-if="getSuffixVisible()">
        <span class="el-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="el-input__icon" v-if="suffixIcon" :class="suffixIcon"></i>
          </template>
          <i
            v-if="showClear"
            class="el-input__icon el-icon-circle-close el-input__clear"
            @mousedown.prevent
            @click="clear"
          ></i>
          <i
            v-if="showPwdVisible"
            class="el-input__icon el-icon-view el-input__clear"
            @click="handlePasswordVisible"
          ></i>
          <span v-if="isWordLimitVisible" class="el-input__count">
            <span class="el-input__count-inner">{{ textLength }}/{{ upperLimit }}</span>
          </span>
        </span>
        <i
          class="el-input__icon"
          v-if="validateState"
          :class="['el-input__validateIcon', validateIcon]"
        ></i>
      </span>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="el-textarea__inner"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    ></textarea>
    <span
      v-if="isWordLimitVisible && type === 'textarea'"
      class="el-input__count"
    >{{ textLength }}/{{ upperLimit }}</span>
  </div>
</template>
<script>
// todo:
// 1. mixins 改成 use

import { reactive, toRefs, inject, ref, getCurrentInstance, toRef } from "vue";
import emitter from "element-ui/src/mixins/emitter";
import Migrating from "element-ui/src/mixins/migrating";

import {
  useValidate,
  useTextarea,
  useInput,
  useInteractive,
  useStatusIcon,
} from "./use";

export default {
  name: "ElInput",

  componentName: "ElInput",

  mixins: [emitter, Migrating],

  inheritAttrs: false,

  inject: {
    elForm: {
      default: "",
    },
    elFormItem: {
      default: "",
    },
  },
  emits: ["input", "change", "blur", "clear", "focus", "update:modelValue"],

  setup(props, { attrs, emit, slots }) {
    console.log(JSON.stringify(slots));
    const state = reactive({
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isComposing: false,
      passwordVisible: false,
    });
    const {
      size,
      disabled,
      resize,
      autosize,
      type,
      modelValue,
      showWordLimit,
      readonly,
      showPassword,
      validateEvent,
      clearable,
    } = toRefs(props);

    const { validateState, validateIcon } = useValidate();
    const { textarea, textareaStyle, resizeTextarea } = useTextarea(
      autosize,
      type,
      resize,
      state.textareaCalcStyle
    );
    const {
      input,
      inputSize,
      inputDisabled,
      nativeInputValue,
      textLength,
      upperLimit,
      isWordLimitVisible,
      inputExceed,
      showClear,
      showPwdVisible,
    } = useInput(
      size,
      type,
      disabled,
      modelValue,
      readonly,
      clearable,
      showPassword,
      showWordLimit,
      toRefs(state),
      textarea,
      attrs
    );
    const {
      focus,
      blur,
      select,
      setNativeInputValue,
      handleBlur,
      handleFocus,
      handleInput,
      handleChange,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd,
      clear,
      handlePasswordVisible,
      updateIconOffset,
    } = useInteractive(
      getCurrentInstance(),
      input,
      nativeInputValue,
      modelValue,
      toRefs(state),
      validateEvent,
      emit,
      slots
    );
    const { needStatusIcon } = useStatusIcon();

    return {
      ...toRefs(state),
      inputSize,
      validateState,
      validateIcon,
      inputDisabled,
      nativeInputValue,
      upperLimit,
      isWordLimitVisible,
      inputExceed,
      textLength,
      textarea,
      textareaStyle,
      resizeTextarea,
      input,
      showClear,
      showPwdVisible,
      focus,
      blur,
      select,
      setNativeInputValue,
      handleBlur,
      handleFocus,
      handleInput,
      handleChange,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd,
      clear,
      handlePasswordVisible,
      updateIconOffset,
      needStatusIcon,
    };
  },

  props: {
    modelValue: [String, Number],
    size: String,
    resize: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: "text",
    },
    autosize: {
      type: [Boolean, Object],
      default: false,
    },
    autocomplete: {
      type: String,
      default: "off",
    },
    validateEvent: {
      type: Boolean,
      default: true,
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false,
    },
    showPassword: {
      type: Boolean,
      default: false,
    },
    showWordLimit: {
      type: Boolean,
      default: false,
    },
    tabindex: String,
  },
  watch: {
    modelValue(val) {
      this.$nextTick(this.resizeTextarea);
      if (this.validateEvent) {
        this.dispatch("ElFormItem", "el.form.change", [val]);
      }
    },
    // native input value is set explicitly
    // do not use v-model / :value in template
    // see: https://github.com/ElemeFE/element/issues/14521
    nativeInputValue() {
      this.setNativeInputValue();
    },
    // when change between <input> and <textarea>,
    // update DOM dependent value and styles
    // https://github.com/ElemeFE/element/issues/14857
    type() {
      this.$nextTick(() => {
        this.setNativeInputValue();
        this.resizeTextarea();
        this.updateIconOffset();
      });
    },
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          icon: "icon is removed, use suffix-icon / prefix-icon instead.",
          "on-icon-click": "on-icon-click is removed.",
        },
        events: {
          click: "click is removed.",
        },
      };
    },

    getSuffixVisible() {
      return (
        this.$slots.suffix ||
        this.suffixIcon ||
        this.showClear ||
        this.showPassword ||
        this.isWordLimitVisible ||
        (this.validateState && this.needStatusIcon)
      );
    },
  },

  mounted() {
    this.setNativeInputValue();
    this.resizeTextarea();
    this.updateIconOffset();
  },

  updated() {
    this.$nextTick(this.updateIconOffset);
  },
};
</script>
