<template>
  <div>
    <template v-for="(item, index) in rateItems" :key="index">
      <span
        class="el-rate__item"
        @click="rateItemClick(index)"
        @mouseover="hover(item, index)"
        @mouseout="putOut(item)"
      >
        <i :class="item.classes"></i>
      </span>
    </template>
  </div>
</template>

<script>
import { toRefs } from 'vue'
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

    const { rateItems, click: rateItemClick, hover, putOut } = useRateItem(
      max.value
    )

    return {
      hover,
      rateItems,
      rateItemClick,
      putOut
    }
  }
}
</script>

<style lang="scss" scoped></style>
