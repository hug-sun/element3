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
