export function isString(obj: Object) {
  return Object.prototype.toString.call(obj) === '[object String]'
}
