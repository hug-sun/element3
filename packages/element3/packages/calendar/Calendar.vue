<template>
  <div class="el-calendar">
    <div class="el-calendar__header">
      <div class="el-calendar__title">{{ i18nDate }}</div>
      <div class="el-calendar__button-group" v-if="validatedRange.length === 0">
        <el-button-group>
          <el-button
            type="plain"
            size="mini"
            @click="selectDate('prev-month')"
            >{{ t('el.datepicker.prevMonth') }}</el-button
          >
          <el-button type="plain" size="mini" @click="selectDate('today')">{{
            t('el.datepicker.today')
          }}</el-button>
          <el-button
            type="plain"
            size="mini"
            @click="selectDate('next-month')"
            >{{ t('el.datepicker.nextMonth') }}</el-button
          >
        </el-button-group>
      </div>
    </div>
    <div class="el-calendar__body" v-if="validatedRange.length === 0">
      <date-table
        :date="date"
        :selected-day="realSelectedDay"
        :first-day-of-week="realFirstDayOfWeek"
        @pick="pickDay"
      />
    </div>
    <div v-else class="el-calendar__body">
      <date-table
        v-for="(range, index) in validatedRange"
        :key="index"
        :date="range[0]"
        :selected-day="realSelectedDay"
        :range="range"
        :hide-header="index !== 0"
        :first-day-of-week="realFirstDayOfWeek"
        @pick="pickDay"
      />
    </div>
  </div>
</template>

<script>
import { useLocale } from '../../src/composables/locale'
import fecha from '../../src/utils/date'
import { ElButton } from '../../src/components/Button'
import ElButtonGroup from '../button-group'
import DateTable from './DateTable'
import { validateRangeInOneMonth } from '../../src/utils/date-util'
import { reactive, provide, computed, toRefs, getCurrentInstance } from 'vue'

const validTypes = ['prev-month', 'today', 'next-month']
const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]
const oneDay = 86400000

export default {
  name: 'ElCalendar',

  components: {
    DateTable,
    ElButton,
    ElButtonGroup
  },

  props: {
    modelValue: [Date, String, Number],
    range: {
      type: Array,
      validator(range) {
        if (Array.isArray(range)) {
          return (
            range.length === 2 &&
            range.every(
              (item) =>
                typeof item === 'string' ||
                typeof item === 'number' ||
                item instanceof Date
            )
          )
        } else {
          return true
        }
      }
    },
    firstDayOfWeek: {
      type: Number,
      default: 1
    }
  },
  emits: ['input', 'update:modelValue'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()

    provide('elCalendar', instance)

    const state = reactive({
      selectedDay: '',
      now: new Date()
    })

    const t = useLocale()

    // computed

    const prevMonthDatePrefix = computed(() => {
      const temp = new Date(date.value.getTime())
      temp.setDate(0)
      return fecha.format(temp, 'yyyy-MM')
    })
    const curMonthDatePrefix = computed(() => {
      return fecha.format(date.value, 'yyyy-MM')
    })

    const nextMonthDatePrefix = computed(() => {
      const temp = new Date(
        date.value.getFullYear(),
        date.value.getMonth() + 1,
        1
      )
      return fecha.format(temp, 'yyyy-MM')
    })

    const formatedDate = computed(() => {
      return fecha.format(date.value, 'yyyy-MM-dd')
    })
    const i18nDate = computed(() => {
      const year = date.value.getFullYear()
      const month = date.value.getMonth() + 1

      const pickedMonth = 'el.datepicker.month' + month

      return `${year} ${t('el.datepicker.year')} ${t(pickedMonth)}`
    })

    const formatedToday = computed(() => {
      return fecha.format(state.now, 'yyyy-MM-dd')
    })
    const realSelectedDay = computed({
      get() {
        if (!props.modelValue) return state.selectedDay
        return formatedDate.value
      },
      set(val) {
        state.selectedDay = val
        const date = new Date(val)

        emit('input', date)
        emit('update:modelValue', date)
      }
    })

    const date = computed(() => {
      if (!props.modelValue) {
        if (realSelectedDay.value) {
          const d = state.selectedDay.split('-')
          return new Date(d[0], d[1] - 1, d[2])
        } else if (validatedRange.value.length) {
          return validatedRange.value[0][0]
        }
        return state.now
      } else {
        return toDate(props.modelValue)
      }
    })
    const validatedRange = computed(() => {
      let range = props.range

      if (!range) return []
      range =
        props.range &&
        range.reduce((prev, val, index) => {
          const date = toDate(val)
          if (rangeValidator(date, index === 0)) {
            prev = prev.concat(date)
          }
          return prev
        }, [])

      if (range.length === 2) {
        const [start, end] = range
        if (start > end) {
          console.warn(
            '[ElementCalendar]end time should be greater than start time'
          )
          return []
        }
        // start time and end time in one month
        if (validateRangeInOneMonth(start, end)) {
          return [[start, end]]
        }
        const data = []
        let startDay = new Date(start.getFullYear(), start.getMonth() + 1, 1)
        const lastDay = toDate(startDay.getTime() - oneDay)
        if (!validateRangeInOneMonth(startDay, end)) {
          console.warn(
            '[ElementCalendar]start time and end time interval must not exceed two months'
          )
          return []
        }
        // 第一个月的时间范围
        data.push([start, lastDay])
        // 下一月的时间范围，需要计算一下该月的第一个周起始日
        const firstDayOfWeek = realFirstDayOfWeek.value
        const nextMontFirstDay = startDay.getDay()
        let interval = 0
        if (nextMontFirstDay !== firstDayOfWeek) {
          if (firstDayOfWeek === 0) {
            interval = 7 - nextMontFirstDay
          } else {
            interval = firstDayOfWeek - nextMontFirstDay
            interval = interval > 0 ? interval : 7 + interval
          }
        }
        startDay = toDate(startDay.getTime() + interval * oneDay)
        if (startDay.getDate() < end.getDate()) {
          data.push([startDay, end])
        }
        return data
      }
      return []
    })
    // if range is valid, we get a two-digit array
    const realFirstDayOfWeek = computed(() => {
      if (props.firstDayOfWeek < 1 || props.firstDayOfWeek > 6) {
        return 0
      }
      return Math.floor(props.firstDayOfWeek)
    })

    // methods;

    const pickDay = (day) => {
      realSelectedDay.value = day
    }

    const selectDate = (type) => {
      if (validTypes.indexOf(type) === -1) {
        throw new Error(`invalid type ${type}`)
      }
      let day = ''
      if (type === 'prev-month') {
        day = `${prevMonthDatePrefix.value}-01`
      } else if (type === 'next-month') {
        day = `${nextMonthDatePrefix.value}-01`
      } else {
        day = formatedToday.value
      }

      if (day === formatedDate.value) return
      pickDay(day)
    }
    const toDate = (val) => {
      if (!val) {
        throw new Error('invalid val')
      }
      return val instanceof Date ? val : new Date(val)
    }

    const rangeValidator = (date, isStart) => {
      const firstDayOfWeek = realFirstDayOfWeek.value
      const expected = isStart
        ? firstDayOfWeek
        : firstDayOfWeek === 0
        ? 6
        : firstDayOfWeek - 1
      const message = `${isStart ? 'start' : 'end'} of range should be ${
        weekDays[expected]
      }.`
      if (date.getDay() !== expected) {
        console.warn(
          '[ElementCalendar]',
          message,
          'Invalid range will be ignored.'
        )
        return false
      }
      return true
    }

    return {
      ...toRefs(state),
      prevMonthDatePrefix,
      curMonthDatePrefix,
      nextMonthDatePrefix,
      formatedDate,
      i18nDate,
      formatedToday,
      realSelectedDay,
      date,
      validatedRange,
      realFirstDayOfWeek,
      pickDay,
      selectDate,
      toDate,
      t,
      rangeValidator
    }
  }
}
</script>
