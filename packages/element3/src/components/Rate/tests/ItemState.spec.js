import { ItemState } from '../src/ItemState'
import { StarState, TriggerType } from '../src/consts'
describe('ItemState', () => {
  it('init', () => {
    const state = new ItemState()
    expect(state.getState()).toEqual({
      state: StarState.STAR_OFF,
      trigged: TriggerType.EMPTY
    })
  })

  it('putOut', () => {
    const state = new ItemState()
    state.putOut()
    expect(state.getState()).toEqual({
      state: StarState.STAR_OFF,
      trigged: TriggerType.EMPTY
    })
  })
})
