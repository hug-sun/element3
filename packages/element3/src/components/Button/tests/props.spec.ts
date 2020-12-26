import { props } from '../src/props'
describe('Button.props', () => {
  it('size', () => {
    const { size } = props
    expect(size.validator('medium')).toBe(true)
    expect(size.validator('small')).toBe(true)
    expect(size.validator('mini')).toBe(true)
    expect(size.validator('')).toBe(true)
  })

  it('type', () => {
    const { type } = props
    expect(type.validator('primary')).toBe(true)
    expect(type.validator('success')).toBe(true)
    expect(type.validator('warning')).toBe(true)
    expect(type.validator('danger')).toBe(true)
    expect(type.validator('info')).toBe(true)
    expect(type.validator('text')).toBe(true)
  })

  it('nativeType', () => {
    const { nativeType } = props

    expect(nativeType.default).toBe('button')
  })
})
