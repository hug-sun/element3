import { ItemState } from '../src/ItemState'
describe('ItemState', () => {
  it('init', () => {
    const state = new ItemState()
    expect(state.getState()).toEqual({
      state: 'starOff',
      trigged: ''
    })
  })

  it('putOut', () => {
    const state = new ItemState()
    state.putOut()
    expect(state.getState()).toEqual({
      state: 'starOff',
      trigged: ''
    })
  })
})
