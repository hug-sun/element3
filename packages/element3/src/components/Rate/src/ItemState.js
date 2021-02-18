export class ItemState {
  constructor() {
    this.state = 'starOff'
    this.trigged = ''
  }

  click() {
    this.state = 'starOn'
    this.trigged = 'click'
  }

  hover() {
    if (this.trigged !== 'click') {
      this.state = 'starOn'
      this.trigged = 'hover'
    }
  }

  putOut() {
    if (this.trigged === 'hover') {
      this.state = 'starOff'
      this.trigged = ''
    }
  }

  getState() {
    return {
      state: this.state,
      trigged: this.trigged
    }
  }
}
