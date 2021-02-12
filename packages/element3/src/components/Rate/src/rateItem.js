import { reactive } from 'vue'

const State = {
  UN_SELECTED: 'unselected',
  SELECTED: 'selected'
}

export const useRateItem = (max) => {
  const rateItems = reactive([])

  const createRateItem = () => ({
    state: State.UN_SELECTED
  })

  function init() {
    for (let index = 0; index < max.value; index++) {
      rateItems.push(createRateItem())
    }
  }

  function lightUp(index) {
    rateItems.forEach((item, itemIndex) => {
      if (itemIndex <= index) {
        item.state = State.SELECTED
      }
    })
  }

  init()

  return { rateItems, lightUp }
}
