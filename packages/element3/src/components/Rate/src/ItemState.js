import { StarState, TriggerType } from '../src/consts'

// TODO -> starState 需要改成 布尔类型
export class ItemState {
  constructor() {
    this.init()
  }
  init() {
    this.starState = StarState.STAR_OFF
    this.trigged = TriggerType.EMPTY
  }

  click() {
    this.starState = StarState.STAR_ON
    this.trigged = TriggerType.CLICK
  }
  reset() {
    this.init()
  }

  highlight() {
    if (this.trigged !== TriggerType.CLICK) {
      this.starState = StarState.STAR_ON
      this.trigged = TriggerType.HOVER
    }
  }

  putOut() {
    if (this.trigged === TriggerType.HOVER) {
      this.starState = StarState.STAR_OFF
      this.trigged = TriggerType.EMPTY
    }
  }

  getState() {
    return {
      state: this.starState,
      trigged: this.trigged
    }
  }

  isStarOn() {
    return this.starState === StarState.STAR_ON
  }
}
