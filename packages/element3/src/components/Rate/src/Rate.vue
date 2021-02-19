<template>
  <div>
    <template v-for="(item, index) in rateItems" :key="index">
      <span
        class="el-rate__item"
        @click="onClick(index)"
        @mouseover="onHover(item, index)"
        @mouseout="onPutOut(item)"
      >
        <i :class="itemClasses(item)"></i>
      </span>
    </template>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useRateItem } from './rateItem'
export default {
  props: {
    max: {
      type: Number,
      default: 5
    }
  },
  setup(props) {
    const { max } = toRefs(props)

    const { itemClasses } = useItemClasses()

    const {
      rateItems,
      click: onClick,
      hover: onHover,
      putOut: onPutOut
    } = useRateItem(max.value)

    return {
      itemClasses,
      onHover,
      rateItems,
      onClick,
      onPutOut
    }
  }
}

const useItemClasses = () => {
  function toIconClass(item) {
    const iconName = 'el-icon'
    return item.isStarOn() ? `${iconName}-star-on` : `${iconName}-star-off`
  }

  const itemClasses = computed(() => {
    return (item) => {
      const result = [
        {
          hover: item.hover
        },
        toIconClass(item)
      ]

      return result
    }
  })

  return {
    itemClasses
  }
}
</script>

<style lang="scss" scoped></style>
