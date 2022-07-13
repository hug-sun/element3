<script lang="ts" setup>
import { computed, ref } from 'vue'
type AlertType = 'success' | 'info' | 'warning' | 'error'
type AlertEffect = 'light' | 'dark'
interface AlertProps {
  title: string
  type?: AlertType
  effect?: AlertEffect
  closable?: boolean
  closeText?: string
  showIcon?: boolean
  center?: boolean
  description?: string
}

const props = withDefaults(defineProps<AlertProps>(), {
  type: 'info',
  effect: 'light',
  closable: true,
  showIcon: false,
  center: false,
})

const emit = defineEmits(['close'])

// 提示内容样式
function useClasses(props) {
  return computed(() => {
    return [
      `el-alert--${props.type}`,
      `is-${props.effect}`,
      props.center ? 'is-center' : '',
    ]
  })
}
const classes = useClasses(props)

// 是否显示关闭按钮
const showCloseIcon = computed(() => {
  return { display: props.closable ? '' : 'none' }
})

// 自定义关闭按钮文字
const customCloseText = computed(() => {
  return props.closeText ? 'is-customed' : 'el-icon-close'
})

// 关闭Alert
const showAlert = ref<boolean>(true)
function closeAlert() {
  emit('close')
  showAlert.value = false
}

// 是否显示提示icon
const isShowIcon = computed(() => {
  return [
    props.showIcon ? `el-icon-${props.type}` : '',
    {
      'is-big': props.showIcon && props.description,
    },
  ]
})

// 带有辅助性的文字介绍
const alertContent = computed(() => {
  return [
    props.description ? 'is-bold' : '',
  ]
})
</script>

<template>
  <div class="el-alert" :class="classes" role="alert" :style="{ display: showAlert ? '' : 'none', margin: '10px 0' }">
    <!-- 提示icon -->
    <i class="el-alert__icon" :class="isShowIcon" />
    <div class="el-alert__content">
      <!-- 提示内容 -->
      <span :class="alertContent" class="el-alert__title">
        {{ title }}
      </span>

      <!-- 带有辅助性的文字介绍 -->
      <p v-if="description" class="el-alert__description">
        {{ description }}
      </p>

      <!-- 自定义关闭按钮 -->
      <i class="el-alert__closebtn " :class="customCloseText" :style="showCloseIcon" @click="closeAlert">
        {{ closeText ? closeText : '' }}
      </i>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../theme/src/alert.scss'
</style>
