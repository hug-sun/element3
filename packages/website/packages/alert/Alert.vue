<template>
  <transition name="el-alert-fade">
    <div
      class="el-alert"
      :class="[typeClass, center ? 'is-center' : '', 'is-' + effect]"
      v-show="visible"
      role="alert"
    >
      <i
        class="el-alert__icon"
        :class="[iconClass, isBigIcon]"
        v-if="showIcon"
      ></i>
      <div class="el-alert__content">
        <span
          class="el-alert__title"
          :class="[isBoldTitle]"
          v-if="title || $slots.title"
        >
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="el-alert__description" v-if="$slots.default && !description">
          <slot></slot>
        </p>
        <p class="el-alert__description" v-if="description && !$slots.default">
          {{ description }}
        </p>
        <i
          class="el-alert__closebtn"
          :class="{
            'is-customed': closeText !== '',
            'el-icon-close': closeText === ''
          }"
          v-show="closable"
          @click="close"
          >{{ closeText }}</i
        >
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, toRefs, computed } from 'vue'
const TYPE_CLASSES_MAP = {
  success: 'el-icon-success',
  warning: 'el-icon-warning',
  error: 'el-icon-error'
}
export default {
  name: 'ElAlert',
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info'
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeText: {
      type: String,
      default: ''
    },
    showIcon: Boolean,
    center: Boolean,
    effect: {
      type: String,
      default: 'light',
      validator: function (value) {
        return ['light', 'dark'].indexOf(value) !== -1
      }
    }
  },
  emits: ['close'],
  setup(props, { emit, slots }) {
    const { description, type } = toRefs(props)

    const visible = ref(true)
    const close = () => {
      visible.value = false
      emit('close')
    }

    const typeClass = computed(() => {
      return `el-alert--${type.value}`
    })

    const iconClass = computed(() => {
      return TYPE_CLASSES_MAP[type.value] || 'el-icon-info'
    })

    const isBigIcon = computed(() => {
      return description.value || slots.default ? 'is-big' : ''
    })

    const isBoldTitle = computed(() => {
      return description.value || slots.default ? 'is-bold' : ''
    })

    return {
      visible,
      typeClass,
      iconClass,
      isBigIcon,
      isBoldTitle,
      close
    }
  }
}
</script>
