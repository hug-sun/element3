<template>
  <div
    ref="step"
    class="el-step"
    :style="style"
    :class="[
      !isSimple && `is-${direction}`,
      isSimple && 'is-simple',
      isLast && !space && !isCenter && 'is-flex',
      isCenter && !isVertical && !isSimple && 'is-center'
    ]"
  >
    <!-- icon & line -->
    <div class="el-step__head" :class="`is-${currentStatus}`">
      <div
        class="el-step__line"
        :style="isLast ? '' : { marginRight: stepOffset + 'px' }"
      >
        <i class="el-step__line-inner" :style="lineStyle"></i>
      </div>

      <div class="el-step__icon" :class="`is-${icon ? 'icon' : 'text'}`">
        <slot
          v-if="currentStatus !== 'success' && currentStatus !== 'error'"
          name="icon"
        >
          <i v-if="icon" class="el-step__icon-inner" :class="[icon]"></i>
          <div class="el-step__icon-inner" v-if="!icon && !isSimple">
            {{ index + 1 }}
          </div>
        </slot>
        <i
          v-else
          :class="[
            'el-icon-' + (currentStatus === 'success' ? 'check' : 'close')
          ]"
          class="el-step__icon-inner is-status"
        >
        </i>
      </div>
    </div>
    <!-- title & description -->
    <div class="el-step__main">
      <div class="el-step__title" ref="title" :class="['is-' + currentStatus]">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="isSimple" class="el-step__arrow"></div>
      <div v-else class="el-step__description" :class="['is-' + currentStatus]">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
import {
  computed,
  watch,
  onBeforeUnmount,
  inject,
  reactive,
  toRefs,
  onBeforeMount
} from 'vue'
import { propsSymbol, stateSymbol } from './constants'

export default {
  name: 'ElStep',

  props: {
    title: String,
    icon: String,
    description: String,
    status: String
  },

  setup(props) {
    const parentState = inject(stateSymbol)
    const steps = parentState.steps
    const stepOffset = parentState.stepOffset
    const parentProps = inject(propsSymbol)
    const isSimple = parentProps.simple
    const isCenter = parentProps.alignCenter

    const state = reactive({
      index: -1,
      lineStyle: {},
      internalStatus: ''
    })

    const currentStatus = computed(() => {
      return props.status || state.internalStatus
    })

    const prevStatus = computed(() => {
      const prevStep = steps[state.index - 1]
      return prevStep ? prevStep.currentStatus : 'wait'
    })

    const isVertical = computed(() => {
      return parentProps.direction === 'vertical'
    })

    const isLast = computed(() => {
      return state.index === steps.length - 1
    })

    const stepsCount = computed(() => {
      return steps.length
    })

    const space = computed(() => {
      return isSimple ? '' : parentProps.space
    })

    const style = computed(() => {
      const style = {}
      const len = steps.length

      const newSpace =
        typeof space.value === 'number'
          ? space.value + 'px'
          : space.value
          ? space.value
          : 100 / (len - (isCenter ? 0 : 1)) + '%'
      style.flexBasis = newSpace
      if (isVertical.value) return style
      if (isLast.value) {
        style.maxWidth = 100 / stepsCount.value + '%'
      } else {
        style.marginRight = -stepOffset + 'px'
      }

      return style
    })

    const updateStatus = (val) => {
      if (state.index < 0) return

      const prevChild = steps[state.index - 1]

      if (val > state.index) {
        state.internalStatus = parentProps.finishStatus
      } else if (val === state.index && prevStatus.value !== 'error') {
        state.internalStatus = parentProps.processStatus
      } else {
        state.internalStatus = 'wait'
      }

      if (prevChild) prevChild.calcProgress(state.internalStatus)
    }

    const calcProgress = (status) => {
      let step = 100
      const style = {}

      style.transitionDelay = 150 * state.index + 'ms'
      if (status === parentProps.processStatus) {
        step = state.currentStatus !== 'error' ? 0 : 0
      } else if (status === 'wait') {
        step = 0
        style.transitionDelay = -150 * state.index + 'ms'
      }

      style.borderWidth = step && !isSimple ? '1px' : 0
      parentProps.direction === 'vertical'
        ? (style.height = step + '%')
        : (style.width = step + '%')

      state.lineStyle = style
    }

    watch(
      () => state.index,
      () => {
        updateStatus(parentProps.active)
      },
      {
        immediate: true
      }
    )

    watch(() => parentProps.active, updateStatus, {
      immediate: true
    })

    watch(
      () => parentProps.processStatus,
      () => {
        updateStatus(parentProps.active)
      },
      {
        immediate: true
      }
    )
    const instance = {
      state,
      currentStatus,
      calcProgress,
      updateStatus
    }

    onBeforeMount(() => {
      steps.push(instance)
    })

    onBeforeUnmount(() => {
      const index = steps.indexOf(instance)
      if (index >= 0) {
        steps.splice(index, 1)
      }
    })

    return {
      ...toRefs(state),
      currentStatus,
      prevStatus,
      direction: parentProps.direction,
      isSimple,
      isLast,
      isCenter,
      isVertical,
      space,
      style,
      stepOffset
    }
  }
}
</script>
