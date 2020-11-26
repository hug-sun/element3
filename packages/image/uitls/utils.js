/**
* simulate object-fit behavior to compatible with IE11 and other browsers which not support object-fit
*/

export const objectFit = {
    NONE: 'none',
    CONTAIN: 'contain',
    COVER: 'cover',
    FILL: 'fill',
    SCALE_DOWN: 'scale-down'
}

export const getImageStyle = (image, fit) => {
    const {
        clientWidth: containerWidth,
        clientHeight: containerHeight
    } = image 

    if (
        !imageWidth.value ||
        !imageHeight.value ||
        !containerWidth ||
        !containerHeight
    )
        return {}

    const vertical = imageWidth.value / imageHeight.value < 1

    if (fit === ObjectFit.SCALE_DOWN) {
        const isSmaller =
            imageWidth.value < containerWidth &&
            imageHeight.value < containerHeight
        fit = isSmaller ? ObjectFit.NONE : ObjectFit.CONTAIN
    }

    switch (fit) {
        case ObjectFit.NONE:
            return { width: 'auto', height: 'auto' }
        case ObjectFit.CONTAIN:
            return vertical ? { width: 'auto' } : { height: 'auto' }
        case ObjectFit.COVER:
            return vertical ? { height: 'auto' } : { width: 'auto' }
        default:
            return {}
    }
}

export const loadImage = (src, attrs, onLoadCallback, onErrorCallback) => {

    const img = new Image()
    img.onload = (e) => onLoadCallback(e, img)
    img.onerror = (e) => onErrorCallback(e, img)

    Object.keys(attrs).forEach((key) => {
      img.setAttribute(key, attrs[key])
    })

    img.src = src
  }