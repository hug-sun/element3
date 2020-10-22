import Picker from '../picker'
import TimePanel from '../panel/time'
import TimeRangePanel from '../panel/time-range'
import { getCurrentInstance, ref, toRefs, watch } from 'vue'

export default {
  mixins: [Picker],

  name: 'ElTimePicker',

  props: {
    isRange: Boolean,
    arrowControl: Boolean
  },

  setup(props) {
    const { ctx } = getCurrentInstance()
    const { isRange } = toRefs(props)
    const type = ref('')

    watch(isRange, (isRange) => {
      if (ctx.picker) {
        ctx.unmountPicker()
        type.value = isRange ? 'timerange' : 'time'
        ctx.panel = isRange ? TimeRangePanel : TimePanel
        ctx.mountPicker()
      } else {
        type.value = isRange ? 'timerange' : 'time'
        ctx.panel = isRange ? TimeRangePanel : TimePanel
      }
    })

    type.value = isRange.value ? 'timerange' : 'time'
    ctx.panel = isRange.value ? TimeRangePanel : TimePanel
  }
}
