import { RateItems } from './RateItems'

export const useRateItem = (max) => {
  const rateItems = new RateItems(max)

  const click = (index) => rateItems.click(index)
  const hover = (item, index) => rateItems.hover(item, index)
  const putOut = (item) => rateItems.putOut(item)

  return { rateItems: rateItems.getData(), click, hover, putOut }
}
