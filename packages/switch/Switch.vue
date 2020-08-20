<template>
  <div
    class="el-switch"
    :class="{ 'is-checked': isChecked,'is-disabled': disabled}"
    @click.prevent="handleClick"
  >
    <SwitchLabel
      :active="!isChecked"
      type="left"
      :text="inactiveText"
      :iconClass="inactiveIconClass"
    ></SwitchLabel>

    <span
      class="el-switch__core"
      ref="core"
      :style="{ 'width': width+'px','background': backgroundColor, 'border-color': backgroundColor }"
    ></span>

    <SwitchLabel :active="isChecked" type="right" :text="activeText" :iconClass="activeIconClass"></SwitchLabel>
  </div>
</template>
<script>
import { computed, toRefs, onMounted } from 'vue'
import SwitchLabel from './SwitchLabel'
export default {
  name: 'ElSwitch',
  components: {
    SwitchLabel
  },
  props: {
    modelValue: {
      type: [Boolean, String, Number],
      default: false
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 40
    },
    activeText: String,
    inactiveText: String,
    activeIconClass: {
      type: String,
      default: ''
    },
    inactiveIconClass: {
      type: String,
      default: ''
    },
    activeColor: {
      type: String,
      default: ''
    },
    inactiveColor: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    // TODO 涉及到关于 elFrom 的逻辑全部被干掉了
    // 后面处理 elFromItem || elFrom 的时候在添加对应的逻辑
    // name
    // validate-event
    // fout
    // input 相关逻辑
    // 后续可以参考之前的逻辑
    // el-tooltip 现在有问题 等修好了 tooltip 之后再处理 switch 的不同 value 的类型

    const {
      activeValue,
      inactiveValue,
      modelValue,
      disabled,
      width,
      activeText,
      inactiveText,
      activeIconClass,
      inactiveIconClass,
      activeColor,
      inactiveColor
    } = toRefs(props)

    useNormalizeModelValue({
      modelValue,
      activeValue,
      inactiveValue,
      emit
    })

    const isChecked = computed(() => {
      return modelValue.value === activeValue.value
    })

    const backgroundColor = computed(() => {
      return isChecked.value ? activeColor.value : inactiveColor.value
    })

    const { handleClick } = useClick({
      isChecked,
      inactiveValue,
      activeValue,
      disabled,
      emit
    })

    return {
      isChecked,
      disabled,
      width,
      activeText,
      inactiveText,
      inactiveIconClass,
      activeIconClass,
      backgroundColor,
      handleClick
    }
  }
}

const useNormalizeModelValue = ({
  modelValue,
  activeValue,
  inactiveValue,
  emit
}) => {
  onMounted(() => {
    if (
      modelValue.value !== activeValue.value &&
      modelValue.value !== inactiveValue.value
    ) {
      emit('update:modelValue', inactiveValue.value)
    }
  })
}

const useClick = ({
  isChecked,
  inactiveValue,
  activeValue,
  disabled,
  emit
}) => {
  const getNewValue = () => {
    return isChecked.value ? inactiveValue.value : activeValue.value
  }

  const handleClick = () => {
    if (disabled.value) return

    const newValue = getNewValue()
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }

  return {
    handleClick
  }
}
</script>