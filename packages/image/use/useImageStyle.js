import { reactive, toRefs } from 'vue'
import { objectFit } from '../uitls/utils'

export const useImageStyle = (image, fit) => {
  let imageWidth = 0
  let imageHeight = 0

  let style = reactive({
    width: 'auto',
    height: 'auto'
  })

  const { clientWidth: containerWidth, clientHeight: containerHeight } = image

  const vertical = imageWidth / imageHeight < 1

  if (fit === objectFit.SCALE_DOWN) {
    const isSmaller =
      imageWidth.value < containerWidth && imageHeight.value < containerHeight
    fit = isSmaller ? objectFit.NONE : objectFit.CONTAIN
  }

  switch (fit) {
    case objectFit.NONE:
      style.width = 'auto'
      style.height = 'auto'
      break
    case objectFit.CONTAIN:
      vertical ? (style.width = 'auto') : (style.height = 'auto')
      break
    case objectFit.COVER:
      style = vertical ? { height: 'auto' } : { width: 'auto' }
      break
    default:
      break
  }

  return {
    ...toRefs(style)
  }
}
