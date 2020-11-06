<template>
  <div class="el-time-spinner" :class="{ 'has-seconds': showSeconds }">
    <template v-if="!arrowControl">
      <el-scrollbar
        @mouseenter="emitSelectRange('hours')"
        @mousemove="adjustCurrentSpinner('hours')"
        class="el-time-spinner__wrapper"
        wrap-style="max-height: inherit;"
        view-class="el-time-spinner__list"
        noresize
        tag="ul"
        ref="hours"
      >
        <li
          @click="handleClick('hours', { value: hour, disabled: disabled })"
          v-for="(disabled, hour) in hoursList"
          class="el-time-spinner__item"
          :key="hour"
          :class="{ active: hour === hours, disabled: disabled }"
        >
          {{ ('0' + (amPmMode ? hour % 12 || 12 : hour)).slice(-2)
          }}{{ amPm(hour) }}
        </li>
      </el-scrollbar>
      <el-scrollbar
        @mouseenter="emitSelectRange('minutes')"
        @mousemove="adjustCurrentSpinner('minutes')"
        class="el-time-spinner__wrapper"
        wrap-style="max-height: inherit;"
        view-class="el-time-spinner__list"
        noresize
        tag="ul"
        ref="minutes"
      >
        <li
          @click="handleClick('minutes', { value: key, disabled: false })"
          v-for="(enabled, key) in minutesList"
          :key="key"
          class="el-time-spinner__item"
          :class="{ active: key === minutes, disabled: !enabled }"
        >
          {{ ('0' + key).slice(-2) }}
        </li>
      </el-scrollbar>
      <el-scrollbar
        v-show="showSeconds"
        @mouseenter="emitSelectRange('seconds')"
        @mousemove="adjustCurrentSpinner('seconds')"
        class="el-time-spinner__wrapper"
        wrap-style="max-height: inherit;"
        view-class="el-time-spinner__list"
        noresize
        tag="ul"
        ref="seconds"
      >
        <li
          @click="handleClick('seconds', { value: key, disabled: false })"
          v-for="(second, key) in 60"
          class="el-time-spinner__item"
          :class="{ active: key === seconds }"
          :key="key"
        >
          {{ ('0' + key).slice(-2) }}
        </li>
      </el-scrollbar>
    </template>
    <template v-if="arrowControl">
      <div
        @mouseenter="emitSelectRange('hours')"
        class="el-time-spinner__wrapper is-arrow"
      >
        <i
          v-repeat-click="decrease"
          class="el-time-spinner__arrow el-icon-arrow-up"
        ></i>
        <i
          v-repeat-click="increase"
          class="el-time-spinner__arrow el-icon-arrow-down"
        ></i>
        <ul class="el-time-spinner__list" ref="hours">
          <li
            class="el-time-spinner__item"
            :class="{ active: hour === hours, disabled: hoursList[hour] }"
            v-for="(hour, key) in arrowHourList"
            :key="key"
          >
            {{
              hour === undefined
                ? ''
                : ('0' + (amPmMode ? hour % 12 || 12 : hour)).slice(-2) +
                  amPm(hour)
            }}
          </li>
        </ul>
      </div>
      <div
        @mouseenter="emitSelectRange('minutes')"
        class="el-time-spinner__wrapper is-arrow"
      >
        <i
          v-repeat-click="decrease"
          class="el-time-spinner__arrow el-icon-arrow-up"
        ></i>
        <i
          v-repeat-click="increase"
          class="el-time-spinner__arrow el-icon-arrow-down"
        ></i>
        <ul class="el-time-spinner__list" ref="minutes">
          <li
            class="el-time-spinner__item"
            :class="{ active: minute === minutes }"
            v-for="(minute, key) in arrowMinuteList"
            :key="key"
          >
            {{ minute === undefined ? '' : ('0' + minute).slice(-2) }}
          </li>
        </ul>
      </div>
      <div
        @mouseenter="emitSelectRange('seconds')"
        class="el-time-spinner__wrapper is-arrow"
        v-if="showSeconds"
      >
        <i
          v-repeat-click="decrease"
          class="el-time-spinner__arrow el-icon-arrow-up"
        ></i>
        <i
          v-repeat-click="increase"
          class="el-time-spinner__arrow el-icon-arrow-down"
        ></i>
        <ul class="el-time-spinner__list" ref="seconds">
          <li
            v-for="(second, key) in arrowSecondList"
            class="el-time-spinner__item"
            :class="{ active: second === seconds }"
            :key="key"
          >
            {{ second === undefined ? '' : ('0' + second).slice(-2) }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script type="text/babel">
import {
  getRangeHours,
  getRangeMinutes,
  modifyTime
} from '../../../../src/utils/date-util'
import {
  computed,
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs,
  unref
} from 'vue'
import ElScrollbar from '../../../scrollbar'
import RepeatClick from '../../../../src/directives/repeatClick'

export default {
  components: { ElScrollbar },

  directives: {
    repeatClick: RepeatClick
  },

  props: {
    date: {},
    defaultValue: {}, // reserved for future use
    showSeconds: {
      type: Boolean,
      default: true
    },
    arrowControl: Boolean,
    amPmMode: {
      type: String,
      default: '' // 'a': am/pm; 'A': AM/PM
    }
  },

  setup(props, { emit }) {
    const { ctx } = getCurrentInstance()
    const state = reactive({
      selectableRange: [],
      currentScrollbar: null
    })

    const {
      hours,
      minutes,
      seconds,
      hoursList,
      minutesList,
      arrowHourList,
      arrowMinuteList,
      arrowSecondList,
      amPm,
      modifyDateField
    } = useTime(state, props, emit)

    function getNow(type) {
      if (type === 'hours') {
        return hours
      } else if (type === 'minutes') {
        return minutes
      } else if (type === 'seconds') {
        return seconds
      }
    }

    function adjustSpinners() {
      adjustSpinner('hours', hours)
      adjustSpinner('minutes', minutes)
      adjustSpinner('seconds', seconds)
    }

    function adjustCurrentSpinner(type) {
      adjustSpinner(type, getNow(type))
    }

    function adjustSpinner(type, value) {
      if (props.arrowControl) return
      const el = ctx.$refs[type].wrap
      if (el) {
        el.scrollTop = Math.max(0, value.value * typeItemHeight(type))
      }
    }

    function typeItemHeight(type) {
      return ctx.$refs[type].$el.querySelector('li').offsetHeight
    }

    const {
      increase,
      decrease,
      handleClick,
      emitSelectRange,
      scrollDown,
      scrollBarHeight,
      bindScrollEvent,
      handleScrol
    } = useScroll({
      state,
      emit,
      ctx,
      hoursList,
      getNow,
      modifyDateField,
      adjustSpinner,
      typeItemHeight
    })

    onMounted(() => {
      ctx.$nextTick(() => {
        !props.arrowControl && bindScrollEvent()
      })
    })

    return {
      // data
      ...toRefs(state),
      // computed
      hours,
      minutes,
      seconds,
      hoursList,
      minutesList,
      arrowHourList,
      arrowMinuteList,
      arrowSecondList,
      // method
      adjustSpinners,
      adjustCurrentSpinner,
      adjustSpinner,
      typeItemHeight,
      amPm,
      modifyDateField,
      increase,
      decrease,
      handleClick,
      emitSelectRange,
      scrollDown,
      scrollBarHeight,
      bindScrollEvent,
      handleScrol
    }
  }
}

function useTime(state, props, emit) {
  const hours = computed(() => props.date.getHours())
  const minutes = computed(() => props.date.getMinutes())
  const seconds = computed(() => props.date.getSeconds())
  const hoursList = computed(() => getRangeHours(state.selectableRange))
  const minutesList = computed(() => {
    return getRangeMinutes(state.selectableRange, hours.value)
  })

  const arrowHourList = computed(() => {
    return [
      unref(hours) > 0 ? unref(hours) - 1 : undefined,
      unref(hours),
      unref(hours) < 23 ? unref(hours) + 1 : undefined
    ]
  })

  const arrowMinuteList = computed(() => {
    return [
      unref(minutes) > 0 ? unref(minutes) - 1 : undefined,
      unref(minutes),
      unref(minutes) < 59 ? unref(minutes) + 1 : undefined
    ]
  })

  const arrowSecondList = computed(() => {
    return [
      unref(seconds) > 0 ? unref(seconds) - 1 : undefined,
      unref(seconds),
      unref(seconds) < 59 ? unref(seconds) + 1 : undefined
    ]
  })

  function modifyDateField(type, value) {
    switch (type) {
      case 'hours':
        emit(
          'change',
          modifyTime(props.date, value, unref(minutes), unref(seconds))
        )
        break
      case 'minutes':
        emit(
          'change',
          modifyTime(props.date, unref(hours), value, unref(seconds))
        )
        break
      case 'seconds':
        emit(
          'change',
          modifyTime(props.date, unref(hours), unref(minutes), value)
        )
        break
    }
  }

  function amPm(hour) {
    const shouldShowAmPm = props.amPmMode.toLowerCase() === 'a'
    if (!shouldShowAmPm) return ''
    const isCapital = props.amPmMode === 'A'
    let content = unref(hour) < 12 ? ' am' : ' pm'
    if (isCapital) content = content.toUpperCase()
    return content
  }

  return {
    hours,
    minutes,
    seconds,
    hoursList,
    minutesList,
    arrowHourList,
    arrowMinuteList,
    arrowSecondList,
    amPm,
    modifyDateField
  }
}

function useScroll({
  state,
  emit,
  ctx,
  hoursList,
  getNow,
  modifyDateField,
  adjustSpinner,
  typeItemHeight
}) {
  function increase() {
    scrollDown(1)
  }

  function decrease() {
    scrollDown(-1)
  }

  function handleClick(type, { value, disabled }) {
    if (!disabled) {
      modifyDateField(type, value)
      emitSelectRange(type)
      adjustSpinner(type, value)
    }
  }

  function emitSelectRange(type) {
    if (type === 'hours') {
      emit('select-range', 0, 2)
    } else if (type === 'minutes') {
      emit('select-range', 3, 5)
    } else if (type === 'seconds') {
      emit('select-range', 6, 8)
    }
    state.currentScrollbar = type
  }

  function scrollDown(step) {
    if (!state.currentScrollbar) {
      emitSelectRange('hours')
    }

    const label = state.currentScrollbar
    let now = getNow(label)

    if (state.currentScrollbar === 'hours') {
      let total = Math.abs(step)
      step = step > 0 ? 1 : -1
      let length = unref(hoursList).length
      while (length-- && total) {
        now =
          (now.value + step + unref(hoursList).length) % unref(hoursList).length
        if (unref(hoursList)[now.value]) {
          continue
        }
        total--
      }
      if (unref(hoursList)[now.value]) return
    } else {
      now = (now.value + step + 60) % 60
    }

    modifyDateField(label, now)
    adjustSpinner(label, now)
    ctx.$nextTick(() => emitSelectRange(state.currentScrollbar))
  }

  function scrollBarHeight(type) {
    return ctx.$refs[type].$el.offsetHeight
  }

  function bindScrollEvent() {
    const bindFuntion = (type) => {
      ctx.$refs[type].wrap.onscroll = (e) => {
        // TODO: scroll is emitted when set scrollTop programatically
        // should find better solutions in the future!
        handleScroll(type, e)
      }
    }
    bindFuntion('hours')
    bindFuntion('minutes')
    bindFuntion('seconds')
  }

  function handleScroll(type) {
    const value = Math.min(
      Math.round(
        (ctx.$refs[type].wrap.scrollTop -
          (scrollBarHeight(type) * 0.5 - 10) / typeItemHeight(type) +
          3) /
          typeItemHeight(type)
      ),
      type === 'hours' ? 23 : 59
    )
    modifyDateField(type, value)
  }

  return {
    increase,
    decrease,
    handleClick,
    emitSelectRange,
    scrollDown,
    scrollBarHeight,
    bindScrollEvent,
    handleScroll
  }
}
</script>
