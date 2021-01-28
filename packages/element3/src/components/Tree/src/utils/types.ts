export function isObject<T>(value: T): boolean {
  return value && typeof value === 'object'
}

export function isArray<T>(value: T): boolean {
  return value instanceof Array
}
