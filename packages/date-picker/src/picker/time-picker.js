import Picker from '../picker'
import TimePanel from '../panel/time'
import TimeRangePanel from '../panel/time-range'
import { getCurrentInstance, ref, toRefs, watch, onCreate } from 'vue'

export default {
  mixins: [Picker],

  name: 'ElTimePicker',

  props: {
    isRange: Boolean,
    arrowControl: Boolean
  },

  setup(props) {
    const instance = getCurrentInstance()
    const { isRange } = toRefs(props)
    const type = ref('')

    watch(isRange, (isRange) => {
      if (instance.ctx.picker) {
        instance.ctx.unmountPicker()
        type.value = isRange ? 'timerange' : 'time'
        instance.ctx.panel = isRange ? TimeRangePanel : TimePanel
        instance.ctx.mountPicker()
      } else {
        type.value = isRange ? 'timerange' : 'time'
        instance.ctx.panel = isRange ? TimeRangePanel : TimePanel
      }
    })

    onCreate(() => {
      type.value = isRange.value ? 'timerange' : 'time'
      instance.ctx.panel = isRange.value ? TimeRangePanel : TimePanel
    })
  }
}
