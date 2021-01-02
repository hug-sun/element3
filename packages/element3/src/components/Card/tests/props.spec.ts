import { props } from '../src/props'
describe('Card.props', () => {
  it('shadow', () => {
    const { shadow } = props

    expect(shadow.validator('always')).toBe(true)
    expect(shadow.validator('hover')).toBe(true)
    expect(shadow.validator('never')).toBe(true)
    expect(shadow.validator('')).toBe(false)
    expect(shadow.default).toBe('always')
  })

  it('body-style', () => {
    const { bodyStyle } = props

    expect(bodyStyle.default().padding).toBe('20px')
  })
})
