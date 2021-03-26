import { reactive } from 'vue'
import { ItemState } from './ItemState'
export const createRateItem = () => {
  return reactive({
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
}
