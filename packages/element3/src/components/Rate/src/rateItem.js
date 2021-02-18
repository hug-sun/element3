import { ItemState } from './ItemState'
import { computed, reactive } from 'vue'

export const useRateItem = (max) => {
  const rateItems = reactive([])

  const createRateItem = () => {
    const item = reactive({
      state: new ItemState(),
      hover: false
    })

    item.classes = computed(() => {
      const result = [
        {
          hover: item.hover
        },
        toIconClass(item.state.getState().state)
      ]
      return result
    })

    return item
  }

  function toIconClass(state) {
    if (state === 'starOn') {
      return 'el-icon-star-on'
    }
    return 'el-icon-star-off'
  }

  function init() {
    for (let index = 0; index < max; index++) {
      rateItems.push(createRateItem())
    }
  }

  function click(index) {
    toStarOn(index, (item) => {
      item.state.click()
    })
  }

  function toStarOn(index, callback) {
    rateItems.forEach((item, itemIndex) => {
      if (itemIndex <= index) {
        callback(item)
      }
    })
  }

  function hover(item, index) {
    toStarOn(index, (item) => {
      item.state.hover()
    })
    _hover(item)
  }

  function _hover(item) {
    item.hover = true
  }

  function putOut(item) {
    rateItems.forEach((item) => {
      item.state.putOut()
    })
    item.hover = false
  }

  init()

  return { rateItems, click, hover, putOut }
}
