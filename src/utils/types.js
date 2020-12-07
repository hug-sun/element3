export function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]'
}

export function isNumber(obj) {
  return Object.prototype.toString.call(obj) === '[object Number]'
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isArray(value) {
  return value instanceof Array
}
export function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE
}

export const isFunction = (functionToCheck) => {
  var getType = {}
  return (
    functionToCheck &&
    getType.toString.call(functionToCheck) === '[object Function]'
  )
}

export const isUndefined = (val) => {
  // eslint-disable-next-line no-void
  return val === void 0
}

export const isDefined = (val) => {
  return val !== undefined && val !== null
}
