
<template>
  <button
    class="el-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>
<script>
// 问题
// button 和 from 表单有个强耦合关系
// 现在的逻辑是，如果当前 button 没有设置值的话，就通过 inject 内的 elFrom 或者 elFormItem 来获取值（ 大小和是否显示 ）
// 更好的做法应该是不在强耦合 from ，只要 inject 上获取到 大小和是否显示 值的话，就直接处理即可

// @TODO 暂时先把 inject 改成 vue3 获取 inject 的形式
// 后续更改 From 的时候需要测试这个点

import { computed, inject, toRefs, unref, getCurrentInstance } from "vue";
import { createForLoopParams } from "@vue/compiler-dom";

export default {
  name: "ElButton",

  props: {
    type: {
      type: String,
      default: "default",
    },
    size: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    nativeType: {
      type: String,
      default: "button",
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
  },

  setup(props, ctx) {
    const { size, disabled } = toRefs(props);

    const buttonSize = useButtonSize(size);
    const buttonDisabled = useButtonDisabled(disabled);

    const handleClick = (evt) => {
      ctx.emit("click", evt);
    };

    return {
      handleClick,
      buttonSize,
      buttonDisabled,
    };
  },
};

const useButtonSize = (size) => {
  const elFormItem = inject("elFormItem", {});

  const _elFormItemSize = computed(() => {
    return unref(elFormItem.elFormItemSize);
  });

  const buttonSize = computed(() => {
    return (
      size.value ||
      _elFormItemSize.value ||
      (getCurrentInstance().proxy.$ELEMENT || {}).size
    );
  });

  return buttonSize;
};

const useButtonDisabled = (disabled) => {
  const elForm = inject("elForm", {});

  const buttonDisabled = computed(() => {
    return disabled.value || unref(elForm.disabled);
  });

  return buttonDisabled;
};
</script>
