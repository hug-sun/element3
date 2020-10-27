<template>
  <transition name="el-zoom-in-top" @after-leave="$emit('dodestroy')">
    <div v-show="visible" class="el-time-panel el-popper" :class="popperClass">
      <div
        class="el-time-panel__content"
        :class="{ 'has-seconds': showSeconds }"
      >
        <time-spinner
          ref="spinner"
          @change="handleChange"
          :arrow-control="useArrow"
          :show-seconds="showSeconds"
          :am-pm-mode="amPmMode"
          @select-range="setSelectionRange"
          :date="date"
        >
        </time-spinner>
      </div>
      <div class="el-time-panel__footer">
        <button
          type="button"
          class="el-time-panel__btn cancel"
          @click="handleCancel"
        >
          {{ t('el.datepicker.cancel') }}
        </button>
        <button
          type="button"
          class="el-time-panel__btn"
          :class="{ confirm: !disabled }"
          @click="handleConfirm()"
        >
          {{ t('el.datepicker.confirm') }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import {
  limitTimeRange,
  isDate,
  clearMilliseconds,
  timeWithinRange
} from 'element-ui/src/utils/date-util'
import { useLocale } from 'element-ui/src/use/locale'
import TimeSpinner from '../basic/time-spinner'
import {
  computed,
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs,
  unref,
  watch
} from 'vue'

export default {
  components: {
    TimeSpinner
  },

  props: {
    // visible: Boolean,
    timeArrowControl: Boolean
  },

  emits: ['pick', 'select-range', 'mounted'],

  setup(props, { emit }) {
    const { ctx } = getCurrentInstance()
    const t = useLocale()
    const { visible, timeArrowControl } = toRefs(props)
    const state = reactive({
      popperClass: '',
      format: 'HH:mm:ss',
      visible,
      value: '',
      defaultValue: null,
      date: new Date(),
      oldValue: new Date(),
      selectableRange: [],
      selectionRange: [0, 2],
      disabled: false,
      arrowControl: false,
      needInitAdjust: true
    })

    const showSeconds = computed(() => {
      return (state.format || '').indexOf('ss') !== -1
    })

    const useArrow = computed(() => {
      return state.arrowControl || timeArrowControl.value || false
    })

    const amPmMode = computed(() => {
      if ((state.format || '').indexOf('A') !== -1) return 'A'
      if ((state.format || '').indexOf('a') !== -1) return 'a'
      return ''
    })

    watch(
      () => state.visible,
      (newVal) => {
        if (newVal) {
          state.oldValue = state.value
          ctx.$nextTick(() => ctx.$refs.spinner.emitSelectRange('hours'))
        } else {
          state.needInitAdjust = true
        }
      }
    )

    watch(
      () => state.value,
      (newVal) => {
        let date
        if (newVal instanceof Date) {
          date = limitTimeRange(newVal, state.selectableRange, state.format)
        } else if (!newVal) {
          date = state.defaultValue ? new Date(state.defaultValue) : new Date()
        }

        state.date = date
        if (state.visible && state.needInitAdjust) {
          ctx.$nextTick(() => adjustSpinners())
          state.needInitAdjust = false
        }
      }
    )

    watch(
      () => state.selectableRange,
      (val) => {
        ctx.$refs.spinner.selectableRange = val
      }
    )

    watch(
      () => state.defaultValue,
      (val) => {
        if (!isDate(state.value)) {
          state.date = val ? new Date(val) : new Date()
        }
      }
    )

    function isValidValue(date) {
      return timeWithinRange(date, state.selectableRange, state.format)
    }

    function adjustSpinners() {
      return ctx.$refs.spinner.adjustSpinners()
    }

    function changeSelectionRange(step) {
      const list = [0, 3].concat(unref(showSeconds) ? [6] : [])
      const mapping = ['hours', 'minutes'].concat(
        unref(showSeconds) ? ['seconds'] : []
      )
      const index = list.indexOf(state.selectionRange[0])
      const next = (index + step + list.length) % list.length
      ctx.$refs.spinner.emitSelectRange(mapping[next])
    }

    const handleCancel = () => {
      emit('pick', state.oldValue, false)
    }

    const handleChange = (date) => {
      // this.visible avoids edge cases, when use scrolls during panel closing animation
      if (state.visible) {
        state.date = clearMilliseconds(date)
        // if date is out of range, do not emit
        if (isValidValue(state.date)) {
          emit('pick', state.date, true)
        }
      }
    }

    const setSelectionRange = (start, end) => {
      emit('select-range', start, end)
      state.selectionRange = [start, end]
    }

    const handleConfirm = (visible = false, first) => {
      if (first) return
      const date = clearMilliseconds(
        limitTimeRange(state.date, state.selectableRange, state.format)
      )
      emit('pick', date, visible, first)
    }

    const handleKeydown = (event) => {
      const keyCode = event.keyCode
      const mapping = { 38: -1, 40: 1, 37: -1, 39: 1 }

      // Left or Right
      if (keyCode === 37 || keyCode === 39) {
        const step = mapping[keyCode]
        changeSelectionRange(step)
        event.preventDefault()
        return
      }

      // Up or Down
      if (keyCode === 38 || keyCode === 40) {
        const step = mapping[keyCode]
        ctx.$refs.spinner.scrollDown(step)
        event.preventDefault()
      }
    }

    onMounted(() => {
      ctx.$nextTick(() => handleConfirm(true, true))
      emit('mounted')
    })

    return {
      t,
      ...toRefs(state),
      showSeconds,
      useArrow,
      amPmMode,
      handleCancel,
      handleChange,
      setSelectionRange,
      handleConfirm,
      handleKeydown,
      isValidValue,
      adjustSpinners,
      changeSelectionRange
    }
  }
}
</script>
