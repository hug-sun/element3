import { props } from '../src/props'

describe('RadioGroup.props', () => {
  it('size', () => {
    const { size } = props

    expect(size.validator('medium')).toBe(true)
    expect(size.validator('small')).toBe(true)
    expect(size.validator('mini')).toBe(true)
    expect(size.validator('')).toBe(true)
  })

  it('fill', () => {
    const { fill } = props

    expect(fill.default).toBe('#409EFF')
  })

  it('textColor', () => {
    const { textColor } = props

    expect(textColor.default).toBe('#ffffff')
  })
})
