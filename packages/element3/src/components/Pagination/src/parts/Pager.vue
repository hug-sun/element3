<template>
  <ul class="el-pager">
    <li
      v-if="pager.count >= 1"
      class="number"
      :class="{ active: pager.current === 1 }"
    >
      1
    </li>
    <li
      v-if="pager.count > pager.viewCount && pager.leftCount > pager.halfPager"
      class="el-icon more btn-quickprev el-icon-more"
      @mouseenter="switchLeft($event.target)"
      @mouseleave="switchLeft($event.target)"
    ></li>
    <li
      v-for="page in pager.midViewPages"
      v-text="page"
      :key="page"
      class="number"
      :class="{
        active: pager.current === page
      }"
    ></li>
    <li
      v-if="pager.count > pager.viewCount && pager.rightCount > pager.halfPager"
      class="el-icon more btn-quicknext el-icon-more"
      @mouseenter="switchRight($event.target)"
      @mouseleave="switchRight($event.target)"
    ></li>
    <li
      v-if="pager.count >= 2"
      v-text="pager.count"
      class="number"
      :class="{
        active: pager.current === pager.count
      }"
    ></li>
  </ul>
</template>

<script lang="ts">
import { Pager } from '../entity/Pager'
import { switchClass } from '../tools/element'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    pager: Pager
  },
  setup() {
    const switchLeft = switchClass(['el-icon-d-arrow-left', 'el-icon-more'])
    const switchRight = switchClass(['el-icon-d-arrow-right', 'el-icon-more'])
    return { switchLeft, switchRight }
  }
})
</script>
