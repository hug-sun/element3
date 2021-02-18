import { useRateItem } from '../src/rateItem'
describe('rateItem', () => {
  it('click -> hover -> putOut', () => {
    const { putOut, hover, click, rateItems } = useRateItem(5)

    click(1)
    hover(rateItems[2], 2)

    putOut(rateItems[2])

    expect(rateItems[0]).toEqual(
      expect.objectContaining({
        state: {
          state: 'starOn',
          trigged: 'click'
        }
      })
    )

    expect(rateItems[1]).toEqual(
      expect.objectContaining({
        state: {
          state: 'starOn',
          trigged: 'click'
        }
      })
    )

    expect(rateItems[2]).toEqual(
      expect.objectContaining({
        hover: false,
        state: {
          state: 'starOff',
          trigged: ''
        }
      })
    )
  })

  it('click -> hover', () => {
    const { hover, click, rateItems } = useRateItem(5)
    click(1)
    hover(rateItems[2], 2)

    expect(rateItems[0]).toEqual(
      expect.objectContaining({
        state: {
          state: 'starOn',
          trigged: 'click'
        }
      })
    )

    expect(rateItems[1]).toEqual(
      expect.objectContaining({
        state: {
          state: 'starOn',
          trigged: 'click'
        }
      })
    )

    expect(rateItems[2]).toEqual(
      expect.objectContaining({
        hover: true,
        state: {
          state: 'starOn',
          trigged: 'hover'
        }
      })
    )
  })
})
