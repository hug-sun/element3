import { props } from '../src/props'
describe('Progress.props', () => {
  it('percentage', () => {
    const { percentage } = props
    expect(percentage.validator(39)).toBe(true)
    expect(percentage.validator(23.9)).toBe(true)
    expect(percentage.validator(0)).toBe(true)
    expect(percentage.validator(100)).toBe(true)
    expect(percentage.validator(-32)).toBe(false)
    expect(percentage.validator(132)).toBe(false)
    expect(percentage.validator('')).toBe(false)
  })

  it('status', () => {
    const { status } = props
    expect(status.validator('success')).toBe(true)
    expect(status.validator('exception')).toBe(true)
    expect(status.validator('warning')).toBe(true)
    expect(status.validator('info')).toBe(false)
    expect(status.validator('')).toBe(false)
  })
})
