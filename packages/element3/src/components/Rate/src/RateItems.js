import { reactive } from 'vue'
import { createRateItem } from './createRateItem'

export class RateItems {
  constructor(max) {
    this.max = max
    this.rateItems = reactive([])
    this.init()
  }

  init() {
    for (let index = 0; index < this.max; index++) {
      this.rateItems.push(createRateItem())
    }
  }

  resetAllItems() {
    this.rateItems.forEach((item) => {
      item.reset()
    })
  }

  toStarOn(index, callback) {
    this.rateItems.forEach((item, itemIndex) => {
      if (itemIndex <= index) {
        callback(item)
      }
    })
  }

  putOut(item) {
    this.rateItems.forEach((item) => {
      item.putOut()
    })
    item.mouseOut()
  }

  hover(item, index) {
    this.toStarOn(index, (item) => {
      item.highlight()
    })

    item.mouseOver()
  }

  click(index) {
    this.resetAllItems()

    this.toStarOn(index, (item) => {
      item.click()
    })
  }

  getData() {
    return this.rateItems
  }
}
