<template>
  <label
    class="el-radio"
    :class="[
      border && radioSize ? 'el-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label },
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span
      class="el-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label,
      }"
    >
      <span class="el-radio__inner"></span>
      <input
        ref="radio"
        class="el-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      />
    </span>
    <span
      class="el-radio__label"
      @keydown.stop
    >
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
import { ref, computed, toRefs, nextTick, getCurrentInstance, inject } from "vue";

export default {
  name: "ElRadio",

  componentName: "ElRadio",

  props: {
    modelValue: [String, Number, Symbol, Boolean],
    label: [String, Number, Symbol, Boolean],
    disabled: Boolean,
    name: String,
    border: Boolean,
    size: String,
  },

  emits: ["update:modelValue", "change"],

  setup (props, ctx) {
    const { modelValue: modelValueRef = {}, label: labelRef = {}, size: sizeRef = {}, disabled: disabledRef = {} } = toRefs(props);
    const radioRef = ref();
    const focusRef = ref(false);

    const { elForm, elFormItem, elRadioGroup } = useInject();

    const { isGroup, radioGroup } = useCheckGroup({ elRadioGroup });

    const { modelRef, handleChange } = useModel({ isGroup, radioGroup, modelValueRef, labelRef, radioRef });

    const { radioSizeRef, isDisabledRef, tabIndexRef } = useStyle({ isGroup, radioGroup, sizeRef, disabledRef, modelRef, labelRef, elForm, elFormItem });

    return {
      radio: radioRef,
      focus: focusRef,
      model: modelRef,
      radioSize: radioSizeRef,
      isDisabled: isDisabledRef,
      tabIndex: tabIndexRef,
      handleChange,
    };
  },
};

function useInject () {
  const elForm = inject('elFrom', {props:{}, ctx:{}});
  const elFormItem = inject('elFormItem', {props:{}, ctx:{}});
  const elRadioGroup = inject('elRadioGroup', null);
  return {
    elForm,
    elFormItem,
    elRadioGroup
  };
}

function useCheckGroup ({elRadioGroup}) {
  if(!elRadioGroup){
    return {
      isGroup: false,
      radioGroup: null
    }
  }
  return {
    isGroup: true,
    radioGroup: elRadioGroup
  };
}

function useModel ({ isGroup, radioGroup, modelValueRef, radioRef, labelRef }) {
  const { emit } = getCurrentInstance();
  
  const modelRef = computed({
    get () {
      return isGroup ? radioGroup.props.modelValue : modelValueRef.value;
    },
    set (val) {
      if (isGroup) {
        radioGroup.emit('update:modelValue', val);
      } else {
        emit("update:modelValue", val);
      }
      radioRef.checked = modelRef.value === labelRef.value;
    },
  });

  async function handleChange (e) {
    await nextTick();
    emit("change",  e.target.value);
    isGroup && radioGroup.emit('change', e.target.value);
  }
  return { modelRef, handleChange }
}

function useStyle ({ isGroup, radioGroup, sizeRef, disabledRef, modelRef, labelRef, elForm, elFormItem }) {
  const { ctx } = getCurrentInstance();
  const elFormDisable = elForm.props.disabled;
  const elFormItemSize = elFormItem.ctx.elFormItemSize;
  const radioSizeRef = computed(() => {
    const temRadioSize = sizeRef.value || elFormItemSize || (ctx.$ELEMENT || {}).size;
    return isGroup ? radioGroup.ctx.radioGroupSize || temRadioSize : temRadioSize;
  });
  const isDisabledRef = computed(() => {
    return isGroup ? radioGroup.props.disabled || disabledRef.value || elFormDisable : disabledRef.value || elFormDisable;
  });

  const tabIndexRef = computed(() => {
    return isDisabledRef.value || (isGroup && modelRef.value !== labelRef.value) ? -1 : 0;
  });

  return {
    radioSizeRef,
    isDisabledRef,
    tabIndexRef
  }
}
</script>
