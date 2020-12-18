<template>
  <el-popover v-bind="$attrs" v-model="visible" trigger="click">
    <div class="el-popconfirm">
      <p class="el-popconfirm__main">
        <i
          v-if="!hideIcon"
          :class="icon"
          class="el-popconfirm__icon"
          :style="{ color: iconColor }"
        ></i>
        {{ title }}
      </p>
      <div class="el-popconfirm__action">
        <el-button size="mini" :type="cancelButtonType" @click="cancel">
          {{ cancelButtonText }}
        </el-button>
        <el-button size="mini" :type="confirmButtonType" @click="confirm">
          {{ confirmButtonText }}
        </el-button>
      </div>
    </div>
    <template v-slot:reference>
      <slot name="reference"></slot>
    </template>
  </el-popover>
</template>

<script>
import { reactive, toRefs } from 'vue'
import ElPopover from '../popover'
import { ElButton } from '../../src/components/Button'
import { t } from '../../src/locale'

export default {
  name: 'ElPopconfirm',
  props: {
    title: {
      type: String
    },
    confirmButtonText: {
      type: String,
      default: t('el.popconfirm.confirmButtonText')
    },
    cancelButtonText: {
      type: String,
      default: t('el.popconfirm.cancelButtonText')
    },
    confirmButtonType: {
      type: String,
      default: 'primary'
    },
    cancelButtonType: {
      type: String,
      default: 'text'
    },
    icon: {
      type: String,
      default: 'el-icon-question'
    },
    iconColor: {
      type: String,
      default: '#f90'
    },
    hideIcon: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ElPopover,
    ElButton
  },
  emits: ['onConfirm', 'onCancel'],
  setup(props, { emit }) {
    const state = reactive({
      visible: false
    })
    const confirm = () => {
      state.visible = false
      // TODO 如果把 onConfirm 修改成 on-confirm 的话就涉及到 api 的变更了
      // 不过在发版之前可以讨论一波
      // eslint-disable-next-line vue/custom-event-name-casing
      emit('onConfirm')
    }
    const cancel = () => {
      state.visible = false
      // eslint-disable-next-line vue/custom-event-name-casing
      emit('onCancel')
    }
    return {
      ...toRefs(state),
      confirm,
      cancel
    }
  }
}
</script>
