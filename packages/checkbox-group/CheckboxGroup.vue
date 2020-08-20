
<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import { provide, getCurrentInstance, computed, inject, watch } from 'vue';
  export default {
    name: 'ElCheckboxGroup',

    props: {
      modelValue: Array,
      disabled: Boolean,
      min: Number,
      max: Number,
      size: String,
      fill: String,
      textColor: String,
      border: Boolean
    },

    emits:[ 'update:modelValue', 'change' ],

    setup(props) {
      const elForm = inject("elForm", { props:{}, ctx:{} });
      const elFormItem = inject("elFormItem", { props:{}, ctx:{}, emit:()=>{} });
      provide('elCheckboxGroup', getCurrentInstance());

      const checkboxGroupSize = computed(()=>{
        return props.size || elFormItem.ctx.elFormItemSize;
      })

      const checkboxGroupDisabled = computed(()=>{
        return props.disabled || elFormItem.props.disabled || elForm.props.disabled;
      })

      watch(props.modelValue, (v)=>{
        elFormItem.emit('el.form.change',v)
      })

      return {
        checkboxGroupSize,
        checkboxGroupDisabled
      }
    }
  };
</script>
