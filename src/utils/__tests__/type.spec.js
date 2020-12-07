import { isNumber } from '../types'
describe('utils type', () => {
  it('assert is a number', () => {
    expect(isNumber(3)).toBeTruthy()
  })

  it('assert is not a number', () => {
    expect(isNumber('3')).toBeFalsy()
    expect(isNumber(NaN)).toBeTruthy()
    expect(isNumber(undefined)).toBeFalsy()
    expect(isNumber([])).toBeFalsy()
    expect(isNumber({})).toBeFalsy()
  })
})
