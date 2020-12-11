<script lang="jsx">
import fecha from '../../src/utils/date'
import {
  range as rangeArr,
  getFirstDayOfMonth,
  getPrevMonthLastDays,
  getMonthDays,
  getI18nSettings,
  validateRangeInOneMonth
} from '../../src/utils/date-util'
import { ref, computed, inject, getCurrentInstance, toRefs } from 'vue'

export default {
  props: {
    selectedDay: String, // formated date yyyy-MM-dd
    range: {
      type: Array,
      validator(val) {
        if (!(val && val.length)) return true
        const [start, end] = val
        return validateRangeInOneMonth(start, end)
      }
    },
    date: Date,
    hideHeader: Boolean,
    firstDayOfWeek: Number
  },

  setup(props, { emit }) {
    const { selectedDay, date, hideHeader, firstDayOfWeek } = toRefs(props)
    const WEEK_DAYS = ref(getI18nSettings().dayNames)

    const elCalendar = inject('elCalendar')

    // methods
    const toNestedArr = (days) => {
      return rangeArr(days.length / 7).map((_, index) => {
        const start = index * 7
        return days.slice(start, start + 7)
      })
    }

    const getFormateDate = (day, type) => {
      if (!day || ['prev', 'current', 'next'].indexOf(type) === -1) {
        throw new Error('invalid day or type')
      }
      let prefix = curMonthDatePrefix.value
      if (type === 'prev') {
        prefix = prevMonthDatePrefix.value
      } else if (type === 'next') {
        prefix = nextMonthDatePrefix.value
      }
      day = `00${day}`.slice(-2)
      return `${prefix}-${day}`
    }

    const getCellClass = ({ text, type }) => {
      const classes = [type]
      if (type === 'current') {
        const date = getFormateDate(text, type)
        if (date === selectedDay.value) {
          classes.push('is-selected')
        }
        if (date === formatedToday.value) {
          classes.push('is-today')
        }
      }
      return classes
    }

    const pickDay = ({ text, type }) => {
      const date = getFormateDate(text, type)
      emit('pick', date)
    }

    const cellRenderProxy = ({ text, type }) => {
      const render = elCalendar.slots.default
      if (!render) return <span>{text}</span>

      const day = getFormateDate(text, type)
      const date = new Date(day)
      const data = {
        isSelected: selectedDay.value === day,
        type: `${type}-month`,
        day
      }

      return render({ date, data })
    }

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

    const formatedToday = computed(() => {
      return elCalendar.formatedToday
    })

    const isInRange = computed(() => {
      return props.range && props.range.length
    })
    const rows = computed(() => {
      let days = []
      // if range exists, should render days in range.
      if (isInRange.value) {
        const [start, end] = props.range
        const currentMonthRange = rangeArr(
          end.getDate() - start.getDate() + 1
        ).map((_, index) => ({
          text: start.getDate() + index,
          type: 'current'
        }))

        let remaining = currentMonthRange.length % 7
        remaining = remaining === 0 ? 0 : 7 - remaining
        const nextMonthRange = rangeArr(remaining).map((_, index) => ({
          text: index + 1,
          type: 'next'
        }))
        days = currentMonthRange.concat(nextMonthRange)
      } else {
        let firstDay = getFirstDayOfMonth(date.value)
        firstDay = firstDay === 0 ? 7 : firstDay
        const _firstDayOfWeek =
          typeof firstDayOfWeek.value === 'number' ? firstDayOfWeek.value : 1
        const prevMonthDays = getPrevMonthLastDays(
          date.value,
          firstDay - _firstDayOfWeek
        ).map((day) => ({
          text: day,
          type: 'prev'
        }))
        const currentMonthDays = getMonthDays(date.value).map((day) => ({
          text: day,
          type: 'current'
        }))
        days = [...prevMonthDays, ...currentMonthDays]
        const nextMonthDays = rangeArr(42 - days.length).map((_, index) => ({
          text: index + 1,
          type: 'next'
        }))
        days = days.concat(nextMonthDays)
      }
      return toNestedArr(days)
    })

    const weekDays = computed(() => {
      const start = firstDayOfWeek.value

      if (typeof start !== 'number' || start === 0) {
        return WEEK_DAYS.value.slice()
      } else {
        return WEEK_DAYS.value
          .slice(start)
          .concat(WEEK_DAYS.value.slice(0, start))
      }
    })

    return () => {
      const instance = getCurrentInstance()

      const thead = hideHeader.value ? null : (
        <thead>
          {weekDays.value.map((day) => (
            <th key={day}>{day}</th>
          ))}
        </thead>
      )
      return (
        <table
          class={{
            'el-calendar-table': true,
            'is-range': isInRange.value
          }}
          cellspacing="0"
          cellpadding="0"
        >
          {thead}
          <tbody>
            {rows.value.map((row, index) => (
              <tr
                class={{
                  'el-calendar-table__row': true,
                  'el-calendar-table__row--hide-border':
                    index === 0 && hideHeader.value
                }}
                key={index}
              >
                {row.map((cell, key) => (
                  <td
                    key={key}
                    class={getCellClass(cell)}
                    onClick={pickDay.bind(instance, cell)}
                  >
                    <div class="el-calendar-day">{cellRenderProxy(cell)}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
  }
}
</script>
