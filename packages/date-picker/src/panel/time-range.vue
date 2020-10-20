<template>
  <transition name="el-zoom-in-top" @after-leave="$emit('dodestroy')">
    <div
      v-show="visible"
      class="el-time-range-picker el-picker-panel el-popper"
      :class="popperClass"
    >
      <div class="el-time-range-picker__content">
        <div class="el-time-range-picker__cell">
          <div class="el-time-range-picker__header">
            {{ t('el.datepicker.startTime') }}
          </div>
          <div
            :class="{ 'has-seconds': showSeconds, 'is-arrow': arrowControl }"
            class="el-time-range-picker__body el-time-panel__content"
          >
            <time-spinner
              ref="minSpinner"
              :show-seconds="showSeconds"
              :am-pm-mode="amPmMode"
              @change="handleMinChange"
              :arrow-control="arrowControl"
              @select-range="setMinSelectionRange"
              :date="minDate"
            >
            </time-spinner>
          </div>
        </div>
        <div class="el-time-range-picker__cell">
          <div class="el-time-range-picker__header">
            {{ t('el.datepicker.endTime') }}
          </div>
          <div
            :class="{ 'has-seconds': showSeconds, 'is-arrow': arrowControl }"
            class="el-time-range-picker__body el-time-panel__content"
          >
            <time-spinner
              ref="maxSpinner"
              :show-seconds="showSeconds"
              :am-pm-mode="amPmMode"
              @change="handleMaxChange"
              :arrow-control="arrowControl"
              @select-range="setMaxSelectionRange"
              :date="maxDate"
            >
            </time-spinner>
          </div>
        </div>
      </div>
      <div class="el-time-panel__footer">
        <button
          type="button"
          class="el-time-panel__btn cancel"
          @click="handleCancel()"
        >
          {{ t('el.datepicker.cancel') }}
        </button>
        <button
          type="button"
          class="el-time-panel__btn confirm"
          @click="handleConfirm()"
          :disabled="btnDisabled"
        >
          {{ t('el.datepicker.confirm') }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import {
  parseDate,
  limitTimeRange,
  modifyDate,
  clearMilliseconds,
  timeWithinRange
} from 'element-ui/src/utils/date-util'
import { useLocale } from 'element-ui/src/use/locale'
import TimeSpinner from '../basic/time-spinner'
import {
  computed,
  getCurrentInstance,
  reactive,
  toRefs,
  unref,
  watch
} from 'vue'

const MIN_TIME = parseDate('00:00:00', 'HH:mm:ss')
const MAX_TIME = parseDate('23:59:59', 'HH:mm:ss')

const minTimeOfDay = function (date) {
  return modifyDate(
    MIN_TIME,
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
}

const maxTimeOfDay = function (date) {
  return modifyDate(
    MAX_TIME,
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
}

// increase time by amount of milliseconds, but within the range of day
const advanceTime = function (date, amount) {
  return new Date(
    Math.min(date.getTime() + amount, maxTimeOfDay(date).getTime())
  )
}

export default {
  components: { TimeSpinner },

  emits: ['pick', 'select-range'],

  setup(props, { emit }) {
    const { ctx } = getCurrentInstance()

    const state = reactive({
      popperClass: '',
      minDate: new Date(),
      maxDate: new Date(),
      value: [],
      oldValue: [new Date(), new Date()],
      defaultValue: null,
      format: 'HH:mm:ss',
      visible: false,
      selectionRange: [0, 2],
      arrowControl: false
    })

    const showSeconds = computed(() => {
      return (state.format || '').indexOf('ss') !== -1
    })

    const offset = computed(() => {
      return unref(showSeconds) ? 11 : 8
    })

    const spinner = computed(() => {
      return state.selectionRange[0] < unref(offset)
        ? ctx.$refs.minSpinner
        : ctx.$refs.maxSpinner
    })

    const btnDisabled = computed(() => {
      return state.minDate.getTime() > state.maxDate.getTime()
    })

    const amPmMode = computed(() => {
      if ((state.format || '').indexOf('A') !== -1) return 'A'
      if ((state.format || '').indexOf('a') !== -1) return 'a'
      return ''
    })

    watch(
      () => state.value,
      (value) => {
        if (Array.isArray(value)) {
          state.minDate = new Date(value[0])
          state.maxDate = new Date(value[1])
        } else {
          if (Array.isArray(state.defaultValue)) {
            state.minDate = new Date(state.defaultValue[0])
            state.maxDate = new Date(state.defaultValue[1])
          } else if (state.defaultValue) {
            state.minDate = new Date(state.defaultValue)
            state.maxDate = advanceTime(
              new Date(state.defaultValue),
              60 * 60 * 1000
            )
          } else {
            state.minDate = new Date()
            state.maxDate = advanceTime(new Date(), 60 * 60 * 1000)
          }
        }
      }
    )

    watch(
      () => state.visible,
      (val) => {
        if (val) {
          state.oldValue = state.value
          ctx.$nextTick(() => ctx.$refs.minSpinner.emitSelectRange('hours'))
        }
      }
    )

    const t = useLocale()

    function isValidValue(date) {
      return (
        Array.isArray(date) &&
        timeWithinRange(state.minDate, ctx.$refs.minSpinner.selectableRange) &&
        timeWithinRange(state.maxDate, ctx.$refs.maxSpinner.selectableRange)
      )
    }

    const handleClear = () => {
      emit('pick', null)
    }

    const handleCancel = () => {
      emit('pick', state.oldValue)
    }

    const handleChange = () => {
      if (isValidValue([state.minDate, state.maxDate])) {
        ctx.$refs.minSpinner.selectableRange = [
          [minTimeOfDay(state.minDate), state.maxDate]
        ]
        ctx.$refs.maxSpinner.selectableRange = [
          [state.minDate, maxTimeOfDay(state.maxDate)]
        ]
        emit('pick', [state.minDate, state.maxDate], true)
      }
    }

    const handleMinChange = (date) => {
      state.minDate = clearMilliseconds(date)
      handleChange()
    }

    const handleMaxChange = (date) => {
      state.maxDate = clearMilliseconds(date)
      handleChange()
    }

    const setMinSelectionRange = (start, end) => {
      emit('select-range', start, end, 'min')
      state.selectionRange = [start, end]
    }

    const setMaxSelectionRange = (start, end) => {
      emit('select-range', start, end, 'max')
      state.selectionRange = [start + unref(offset), end + unref(offset)]
    }

    const handleConfirm = (visible = false) => {
      const minSelectableRange = ctx.$refs.minSpinner.selectableRange
      const maxSelectableRange = ctx.$refs.maxSpinner.selectableRange

      state.minDate = limitTimeRange(
        state.minDate,
        minSelectableRange,
        state.format
      )
      state.maxDate = limitTimeRange(
        state.maxDate,
        maxSelectableRange,
        state.format
      )

      emit('pick', [state.minDate, state.maxDate], visible)
    }

    const adjustSpinners = () => {
      ctx.$refs.minSpinner.adjustSpinners()
      ctx.$refs.maxSpinner.adjustSpinners()
    }

    const changeSelectionRange = (step) => {
      const list = unref(showSeconds) ? [0, 3, 6, 11, 14, 17] : [0, 3, 8, 11]
      const mapping = ['hours', 'minutes'].concat(
        unref(showSeconds) ? ['seconds'] : []
      )
      const index = list.indexOf(this.selectionRange[0])
      const next = (index + step + list.length) % list.length
      const half = list.length / 2
      if (next < half) {
        ctx.$refs.minSpinner.emitSelectRange(mapping[next])
      } else {
        ctx.$refs.maxSpinner.emitSelectRange(mapping[next - half])
      }
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
        unref(spinner).scrollDown(step)
        event.preventDefault()
      }
    }

    return {
      t,
      ...toRefs(state),
      showSeconds,
      offset,
      spinner,
      btnDisabled,
      amPmMode,
      isValidValue,
      handleClear,
      handleCancel,
      handleChange,
      handleMinChange,
      handleMaxChange,
      setMinSelectionRange,
      setMaxSelectionRange,
      handleConfirm,
      adjustSpinners,
      changeSelectionRange,
      handleKeydown
    }
  }
}
</script>
