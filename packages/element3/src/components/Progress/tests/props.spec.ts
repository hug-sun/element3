import { isRef, toRefs, reactive, unref } from 'vue'
import {
  props,
  getColorsIndex,
  sortByPercentage,
  toPercentageColors,
  autoFixPercentage,
  DEFAULT_SVG_PX,
  SVG_MAX_SIZE,
  SVG_VIEW_BOX,
  DEFAULT_STROKE_PX,
  genFnToRelativeSvgSize,
  calcRelativeSvgSize,
  calcSvgRadius,
  generateSvgPathD,
  calcPerimeter,
  genTrailPathStyle,
  genArcPathStyle,
  TRANSITION,
  DEFAULT_COLOR,
  getSvgStrokeColor,
  STATUS_SETTING,
  STATUSES,
  getColorBy,
  getRate,
  getOffset
} from '../src/props'

const colorPercents = [
  { color: '#1989fa', percentage: 80 },
  { color: '#f56c6c', percentage: 20 },
  { color: '#6f7ad3', percentage: 100 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#e6a23c', percentage: 40 }
]
colorPercents.sort(sortByPercentage)

describe('Progress.props', () => {
  it('percentage', () => {
    const { percentage } = props
    expect(percentage.validator(39)).toBe(true)
    expect(percentage.validator(23.9)).toBe(true)
    expect(percentage.validator(0)).toBe(true)
    expect(percentage.validator(100)).toBe(true)
    expect(percentage.validator(-32)).toBe(false)
    expect(percentage.validator(132)).toBe(false)
    // expect(percentage.validator('')).toBe(false)
  })

  it('status', () => {
    expect(STATUSES.length).toBe(3)
    expect(STATUSES[0]).toBe('success')
    expect(STATUSES[1]).toBe('warning')
    expect(STATUSES[2]).toBe('exception')
    const { status } = props
    expect(status.validator('success')).toBe(true)
    expect(status.validator('exception')).toBe(true)
    expect(status.validator('warning')).toBe(true)
    expect(status.validator('info')).toBe(false)
    expect(status.validator('')).toBe(true)
    expect(status.validator(undefined)).toBe(true)
  })

  it('show-text', () => {
    const { showText } = props
    expect(showText.default).toBe(true)
  })

  it('color', () => {
    const { color } = props
    expect(color.default).toBe('')
  })

  it('stroke-width', () => {
    const { strokeWidth } = props
    expect(strokeWidth.default).toBe(6)
  })

  it('text-inside', () => {
    const { textInside } = props
    expect(textInside.default).toBe(false)
  })

  it('type validator', () => {
    const { type } = props
    expect(type.default).toBe('line')
    expect(type.validator('circle')).toBeTruthy()
    expect(type.validator('dashboard')).toBeTruthy()
  })

  it('type width', () => {
    const { width } = props
    expect(width.default).toBe(DEFAULT_SVG_PX)
  })

  it('svg relative max size', () => {
    expect(SVG_MAX_SIZE).toBe(100)
    expect(SVG_VIEW_BOX).toBe('0 0 100 100')
  })

  it('calculate relative stroke width', () => {
    const strokeWidth = DEFAULT_STROKE_PX
    const width = DEFAULT_SVG_PX
    const toRelativeSvgSize = genFnToRelativeSvgSize(width)
    expect(toRelativeSvgSize(width)).toBe(SVG_MAX_SIZE)
    expect(calcRelativeSvgSize(strokeWidth, width)).toBe(4.8)
  })

  it('getRate, getOffset, getPermi', () => {
    expect(getRate('circle')).toBe(1)
    expect(getRate('dashboard')).toBe(0.75)
    expect(getOffset(DEFAULT_SVG_PX, 0.75)).toBe(-15.75)
    expect(getOffset(DEFAULT_SVG_PX, 1)).toBe(-0)
  })

  it('calculate radius, path.d and styles', () => {
    const svgStrokeWidth = 4.8
    const radius = calcSvgRadius(svgStrokeWidth)
    expect(radius).toBe(47.6)
    const svgPathDCircle = generateSvgPathD(svgStrokeWidth)
    expect(svgPathDCircle).toBe(
      `M 50 50 m 0 -47.6 a 47.6 47.6 0 1 1 0 95.2 a 47.6 47.6 0 1 1 0 -95.2`
    )
    const svgPathDDashboard = generateSvgPathD(svgStrokeWidth, 'dashboard')
    expect(svgPathDDashboard).toBe(
      `M 50 50 m 0 47.6 a 47.6 47.6 0 1 1 0 -95.2 a 47.6 47.6 0 1 1 0 95.2`
    )
    const perimeter = calcPerimeter(radius)
    expect(perimeter).toBe(299.0796206217483)
    const strokeStyle = genTrailPathStyle(perimeter)
    expect(strokeStyle.strokeDasharray).toBe('299.1px, 299.1px')
    expect(strokeStyle.strokeDashoffset).toBe('0.0px')

    const percentage = 25
    const circleStyle = genArcPathStyle(perimeter, percentage)
    expect(circleStyle.strokeDasharray).toBe('74.8px, 299.1px')
    expect(circleStyle.strokeDashoffset).toBe('0.0px')
    expect(circleStyle.transition).toBe(TRANSITION)
  })

  it('dashboard type: calculate radius, path.d and styles', () => {
    const svgStrokeWidth = 4.8
    const radius = calcSvgRadius(svgStrokeWidth)
    const perimeter = calcPerimeter(radius)

    const strokeStyle = genTrailPathStyle(perimeter, 'dashboard')
    expect(strokeStyle.strokeDasharray).toBe('224.3px, 299.1px')
    expect(strokeStyle.strokeDashoffset).toBe('-37.4px')

    const percentage = 25
    const dashboardStyle = genArcPathStyle(perimeter, percentage, 'dashboard')
    expect(dashboardStyle.strokeDasharray).toBe('56.1px, 299.1px')
    expect(dashboardStyle.strokeDashoffset).toBe('-37.4px')
    expect(dashboardStyle.transition).toBe(TRANSITION)
  })

  it(':stroke-linecap', () => {
    const { strokeLinecap } = props
    expect(strokeLinecap.default).toBe('round')
    expect(strokeLinecap.validator('round')).toBe(true)
    expect(strokeLinecap.validator('butt')).toBe(true)
    expect(strokeLinecap.validator('square')).toBe(true)
  })

  it('color and status', () => {
    const color = getSvgStrokeColor()
    expect(color).toBe(DEFAULT_COLOR)

    expect(getSvgStrokeColor('success')).toBe(STATUS_SETTING['success'].color)
    expect(getSvgStrokeColor('warning')).toBe(STATUS_SETTING['warning'].color)
    expect(getSvgStrokeColor('exception')).toBe(
      STATUS_SETTING['exception'].color
    )

    expect(getSvgStrokeColor(null, '#996600')).toBe('#996600')
    expect(getSvgStrokeColor(null, '#996600', 30)).toBe('#996600')
    expect(getSvgStrokeColor(null, '#996600', 30)).toBe('#996600')

    expect(getSvgStrokeColor('', colorPercents, 30)).toBe(
      colorPercents[1].color
    )
  })

  it('learn isRef and unref', () => {
    expect(isRef(undefined)).toBeFalsy()
    expect(isRef(null)).toBeFalsy()
    expect(isRef(0)).toBeFalsy()
    expect(isRef('')).toBeFalsy()
    expect(isRef(false)).toBeFalsy()
    expect(isRef(true)).toBeFalsy()
    expect(unref(undefined)).toBeUndefined()
    expect(unref(null)).toBe(null)
    expect(unref(0)).toBe(0)
    expect(unref('')).toBe('')
    expect(unref(false)).toBeFalsy()
    expect(unref(true)).toBeTruthy()
  })

  it('should get ref value correct', () => {
    const props = reactive({
      percentage: 0,
      color: ['#336699', '#339966', '#996633']
    })
    const { percentage, color } = toRefs(props)
    const pv = unref(percentage)
    expect(pv).toBe(props.percentage)
    const cv = color.value
    expect(cv).toEqual(props.color)
  })

  it('get index of percentage in array', () => {
    expect(getColorsIndex(colorPercents, 0)).toBe(0)
    expect(getColorsIndex(colorPercents, 12)).toBe(0)
    expect(getColorsIndex(colorPercents, 20)).toBe(1)
    expect(getColorsIndex(colorPercents, 32)).toBe(1)
    expect(getColorsIndex(colorPercents, 42)).toBe(2)
    expect(getColorsIndex(colorPercents, 62)).toBe(3)
    expect(getColorsIndex(colorPercents, 82)).toBe(4)
    expect(getColorsIndex(colorPercents, 100)).toBe(4)

    expect(getColorBy(colorPercents, 15)).toBe(colorPercents[0].color)
    expect(getColorBy(colorPercents, 35)).toBe(colorPercents[1].color)
    expect(getColorBy(colorPercents, 55)).toBe(colorPercents[2].color)
    expect(getColorBy(colorPercents, 75)).toBe(colorPercents[3].color)
    expect(getColorBy(colorPercents, 85)).toBe(colorPercents[4].color)
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
