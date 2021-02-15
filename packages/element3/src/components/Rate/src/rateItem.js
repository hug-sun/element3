import { computed, reactive, ref, watchEffect } from 'vue'

export const useRateItem = (max) => {
  const rateItems = reactive([])

  const createRateItem = () => {
    const item = reactive({
      state: 'el-icon-star-off',
      hover: false
    })

    item.classes = computed(() => {
      return [
        {
          hover: item.hover
        },
        item.state
      ]
    })

    return item
  }

  function init() {
    for (let index = 0; index < max.value; index++) {
      rateItems.push(createRateItem())
    }
  }

  function lightUp(index) {
    rateItems.forEach((item, itemIndex) => {
      if (itemIndex <= index) {
        item.state = 'el-icon-star-on'
      }
    })
  }

  function hover(item, index) {
    lightUp(index)
    _hover(item)
  }

  function _hover(item) {
    item.hover = true
  }

  function putOut(item) {
    rateItems.forEach((item) => {
      item.state = 'el-icon-star-off'
    })
    item.hover = false
  }

  init()

  return { rateItems, lightUp, hover, putOut }
}
