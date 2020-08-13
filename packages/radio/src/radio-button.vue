<template>
  <label
    class="el-radio-button"
    :class="[
      size ? 'el-radio-button--' + size : '',
      { 'is-active': value === label },
      { 'is-disabled': isDisabled },
      { 'is-focus': focus }
    ]"
    role="radio"
    :aria-checked="value === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="value = isDisabled ? value : label"
  >
    <input
      class="el-radio-button__orig-radio"
      :value="label"
      type="radio"
      v-model="value"
      :name="name"
      @change="handleChange"
      :disabled="isDisabled"
      tabindex="-1"
      @focus="focus = true"
      @blur="focus = false"
    >
    <span
      class="el-radio-button__inner"
      :style="value === label ? activeStyle : null"
      @keydown.stop
    >
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
import { toRefs, ref, inject, getCurrentInstance, computed, nextTick } from 'vue';

export default {
  name: 'ElRadioButton',

  componentName: 'ElRadioButton',

  props: {
    label: [String, Number, Symbol, Boolean],
    disabled: Boolean,
    name: String
  },

  setup (props, ctx) {
    const { label: labelRef = {}, disabled: disabledRef = {} } = toRefs(props);
    const radioRef = ref();
    const focusRef = ref(false);

    const { elForm, elFormItem } = useInject();

    const { radioGroup } = useCheckGroup();

    const { valueRef, handleChange } = useModel({ radioGroup, labelRef, radioRef });

    const { sizeRef, isDisabledRef, tabIndexRef, activeStyleRef } = useStyle({ radioGroup, disabledRef, valueRef, labelRef, elForm, elFormItem });

    return {
      radio: radioRef,
      focus: focusRef,
      value: valueRef,
      size: sizeRef,
      isDisabled: isDisabledRef,
      tabIndex: tabIndexRef,
      activeStyle: activeStyleRef,
      handleChange,
    };
  }
};

function useInject () {
  const elForm = inject('elFrom', {});
  const elFormItem = inject('elFormItem', {});
  return {
    elForm,
    elFormItem
  };
}

function useCheckGroup () {
  let parent = getCurrentInstance().parent;
  while (parent) {
    if (parent.type.componentName !== 'ElRadioGroup') {
      parent = parent.parent;
    } else {
      return {
        isGroup: true,
        radioGroup: parent
      };
    }
  }
  console.warn('ElementUI Warn: `<radio-button></radio-button>` must be use with <radio-group></radio-group>');
  return {
    isGroup: false,
    radioGroup: null
  };
}

function useModel ({ radioGroup, modelValueRef, radioRef, labelRef }) {
  const valueRef = computed({
    get () {
      return radioGroup.props.modelValue;
    },
    set (val) {
      radioGroup.emit('update:modelValue', val);
      radioRef.checked = valueRef.value === labelRef.value;
    },
  });

  async function handleChange (e) {
    await nextTick();
    radioGroup.emit('change', e.target.value);
  }
  return { valueRef, handleChange }
}

function useStyle ({ radioGroup, disabledRef, valueRef, labelRef, elForm, elFormItem }) {
  const { ctx } = getCurrentInstance();
  const elFormDisable = (elForm.props || {}).disabled;
  const elFormItemSize = (elFormItem.ctx || {}).elFormItemSize;

  const sizeRef = computed(() => {
    const temRadioSize = elFormItemSize || (ctx.$ELEMENT || {}).size;
    return radioGroup.ctx.radioGroupSize || temRadioSize;
  });
  const isDisabledRef = computed(() => {
    return radioGroup.props.disabled || disabledRef.value || elFormDisable;
  });
  const tabIndexRef = computed(() => {
    return isDisabledRef.value || (radioGroup && valueRef.value !== labelRef.value) ? -1 : 0;
  });

  const activeStyleRef = computed(() => {
    return {
      backgroundColor: radioGroup.props.fill || '',
      borderColor: radioGroup.props.fill || '',
      boxShadow: radioGroup.props.fill ? `-1px 0 0 0 ${radioGroup.props.fill}` : '',
      color: radioGroup.props.textColor || ''
    };
  })

  return {
    sizeRef,
    isDisabledRef,
    tabIndexRef,
    activeStyleRef
  }
}
</script>
