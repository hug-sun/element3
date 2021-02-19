import { ItemState } from './ItemState'
import { reactive } from 'vue'

const createRateItem = () => {
  const item = reactive({
    state: new ItemState(),
    hover: false,
    mouseOver() {
      this.hover = true
    },
    mouseOut() {
      this.hover = false
    },
    click() {
      this.state.click()
    },
    reset() {
      this.state.reset()
    },
    highlight() {
      this.state.highlight()
    },
    putOut() {
      this.state.putOut()
    },
    isStarOn() {
      return this.state.isStarOn()
    }
  })

  return item
}

export const useRateItem = (max) => {
  const rateItems = reactive([])

  function init() {
    for (let index = 0; index < max; index++) {
      rateItems.push(createRateItem())
    }
  }

  function resetAllItems() {
    rateItems.forEach((item) => {
      item.reset()
    })
  }

  function click(index) {
    resetAllItems()

    toStarOn(index, (item) => {
      item.click()
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
      item.highlight()
    })
    item.mouseOver()
  }

  function putOut(item) {
    rateItems.forEach((item) => {
      item.putOut()
    })
    item.mouseOut()
  }

  init()

  return { rateItems, click, hover, putOut }
}
