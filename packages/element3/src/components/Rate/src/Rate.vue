<template>
  <div>
    <template v-for="(item, index) in rateItems" :key="index">
      <span class="el-rate__item" @click="lightUp(index)">
        <i
          :class="
            item.state === 'unselected' ? 'el-icon-star-off' : 'el-icon-star-on'
          "
        ></i>
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

    const { rateItems, lightUp } = useRateItem(max)

    return {
      rateItems,
      lightUp
    }
  }
}
</script>

<style lang="scss" scoped></style>
