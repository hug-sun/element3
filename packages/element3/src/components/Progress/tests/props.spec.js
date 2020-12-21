import { isRef, toRefs, reactive } from 'vue'
import {
  props,
  getRefValue,
  getColorsIndex,
  sortByPercentage,
  toPercentageColors,
  autoFixPercentage
} from '../src/props'

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

  it('test isRef', () => {
    expect(isRef(undefined)).toBeFalsy()
    expect(isRef(null)).toBeFalsy()
    expect(isRef(0)).toBeFalsy()
    expect(isRef('')).toBeFalsy()
    expect(isRef(false)).toBeFalsy()
    expect(isRef(true)).toBeFalsy()
  })

  it('should get ref value correct', () => {
    const props = reactive({
      percentage: 0,
      color: ['#336699', '#339966', '#996633']
    })
    const { percentage, color } = toRefs(props)
    const pv = getRefValue(percentage)
    expect(pv).toBe(props.percentage)
    const cv = color.value
    expect(cv).toEqual(props.color)
  })

  it('get index of percentage in array', () => {
    const colors = [
      { color: '#1989fa', percentage: 80 },
      { color: '#f56c6c', percentage: 20 },
      { color: '#6f7ad3', percentage: 100 },
      { color: '#5cb87a', percentage: 60 },
      { color: '#e6a23c', percentage: 40 }
    ]
    colors.sort(sortByPercentage)
    expect(getColorsIndex(colors, 0)).toBe(0)
    expect(getColorsIndex(colors, 12)).toBe(0)
    expect(getColorsIndex(colors, 20)).toBe(1)
    expect(getColorsIndex(colors, 32)).toBe(1)
    expect(getColorsIndex(colors, 42)).toBe(2)
    expect(getColorsIndex(colors, 62)).toBe(3)
    expect(getColorsIndex(colors, 82)).toBe(4)
    expect(getColorsIndex(colors, 100)).toBe(4)
  })
  it('should map to percentage colors correct', () => {
    const colors = ['#336699', '#339966', '#996633', '#663399']
    const rs = toPercentageColors(colors)
    expect(rs.length).toBe(4)
    expect(rs[0].color).toBe(colors[0])
    expect(rs[0].percentage).toBe(25)
    expect(rs[1].percentage).toBe(50)
    expect(rs[2].percentage).toBe(75)
    expect(rs[3].percentage).toBe(100)

    const colorObjs = [
      { color: '#1989fa', percentage: 80 },
      { color: '#6f7ad3', percentage: 100 },
      { color: '#5cb87a', percentage: 60 },
      { color: '#f56c6c', percentage: 20 },
      { color: '#e6a23c', percentage: 40 }
    ]
    const objs = toPercentageColors(colorObjs)
    expect(objs.length).toBe(5)
    expect(objs[0].color).toBe(colorObjs[0].color)
    expect(objs[0].percentage).toBe(80)
    expect(objs[1].percentage).toBe(100)
    expect(objs[2].percentage).toBe(60)
    expect(objs[3].percentage).toBe(20)
    expect(objs[4].percentage).toBe(40)
  })

  it('fix percentage value', () => {
    expect(autoFixPercentage(-2)).toBe(0)
    expect(autoFixPercentage(129)).toBe(100)
    expect(autoFixPercentage(29)).toBe(29)
  })
})
