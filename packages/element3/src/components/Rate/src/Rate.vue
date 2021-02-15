<template>
  <div>
    <template v-for="(item, index) in rateItems" :key="index">
      <span
        class="el-rate__item"
        @click="lightUp(index)"
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

    const { rateItems, lightUp, hover, putOut } = useRateItem(max)

    return {
      hover,
      rateItems,
      lightUp,
      putOut
    }
  }
}
</script>

<style lang="scss" scoped></style>
