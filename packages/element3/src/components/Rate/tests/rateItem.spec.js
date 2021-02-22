import { useRateItem } from '../src/rateItem'
import { StarState, TriggerType } from '../src/consts'
describe('rateItem', () => {
  function expectRateItemState(item, starState, trigged) {
    expect(item).toEqual(
      expect.objectContaining({
        state: {
          starState,
          trigged
        }
      })
    )
  }

  function expectRateItemStateWithHover(item, starState, trigged, hover) {
    expect(item).toEqual(
      expect.objectContaining({
        hover,
        state: {
          starState,
          trigged
        }
      })
    )
  }
  it('click -> hover -> putOut', () => {
    const { putOut, hover, click, rateItems } = useRateItem(5)

    click(1)
    hover(rateItems[2], 2)

    putOut(rateItems[2])

    expectRateItemState(rateItems[0], StarState.STAR_ON, TriggerType.CLICK)
    expectRateItemState(rateItems[1], StarState.STAR_ON, TriggerType.CLICK)
    expectRateItemStateWithHover(
      rateItems[2],
      StarState.STAR_OFF,
      TriggerType.EMPTY,
      false
    )
  })

  it('click -> hover', () => {
    const { hover, click, rateItems } = useRateItem(5)
    click(1)
    hover(rateItems[2], 2)

    expectRateItemState(rateItems[0], StarState.STAR_ON, TriggerType.CLICK)
    expectRateItemState(rateItems[1], StarState.STAR_ON, TriggerType.CLICK)
    expectRateItemStateWithHover(
      rateItems[2],
      StarState.STAR_ON,
      TriggerType.HOVER,
      true
    )
  })
})
