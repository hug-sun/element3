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

export const loadImage = (src, attrs, onLoadCallback, onErrorCallback) => {
  const img = new Image()
  img.onload = (e) => onLoadCallback(e, img)
  img.onerror = (e) => onErrorCallback(e, img)

  Object.keys(attrs).forEach((key) => {
    img.setAttribute(key, attrs[key])
  })

  img.src = src
}
