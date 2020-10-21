import { isArray, isObject } from '../../../src/utils/types'

/**
 * Deep traversal of the object
 * @param {object} target
 * @param {function} callback(cloneRawNode, rawNode, isLeaf)
 */
export function nodeMap(
  target,
  callback = () => null,
  { childKey = 'children', mapChildKey = 'children' } = {
    /* TreeNode */
  }
) {
  const dfs = (node) => {
    if (isObject(node) && !isArray(node[childKey])) {
      const _cloneNode = { ...node }
      return callback(_cloneNode, node, true)
    }
    const cloneNode = { ...node }
    const newNode = callback(cloneNode, node, false)
    if (typeof newNode[childKey] !== 'undefined') delete newNode[childKey]
    newNode[mapChildKey] = []
    for (let i = 0; i < node[childKey].length; i++) {
      const _node = node[childKey][i]
      const ret = dfs(_node)
      ret.parent = newNode
      newNode[mapChildKey].push(ret)
    }

    return newNode
  }

  return dfs(target)
}

export function nodeEach(
  target,
  callback = () => false,
  { childKey = 'children', root = null } = {}
) {
  const dfs = (node) => {
    if (!isObject(node) || isArray(node)) {
      return
    }

    const child = node[childKey] || []

    for (let i = 0; i < child.length; i++) {
      const _node = child[i]
      if (callback(_node /* Current */, node /* Parent */)) return
      dfs(_node)
    }
  }
  if (callback(target /* Current */, root /* Parent */)) return
  return dfs(target)
}

/**
 * Modify the property name of the object
 * @param {object} obj
 * @param {object} keyMap newKey mapping oldKey
 */
export function transitionObjectKey(obj, keyMap = {}) {
  const transitionKeyList = Object.keys(keyMap)
  transitionKeyList.forEach((key) => {
    if (key !== keyMap[key]) {
      obj[key] = obj[keyMap[key]]
      delete obj[keyMap[key]]
    }
  })
  return obj
}

export function isBrotherNode(nodeA, nodeB) {
  return nodeA.parent === nodeB.parent
}

export function isGreatGrandfather(nodeA, nodeB) {
  let flag = false
  nodeB.upwardEach((node) => {
    if (node === nodeA) {
      flag = true
      return true
    }
  })

  return flag
}

/**
 *
 * @param {*} _class 构造函数
 * @param {*} funName 方法名
 * @param {*} beforeCall 在之前执行
 * @param {*} afterCall 在之后执行
 */
export function methodInterceptor(
  _class,
  funName,
  beforeCall = () => null,
  afterCall = () => null
) {
  const fun = _class.prototype[funName]
  _class.prototype[funName] = function (...args) {
    const _args = beforeCall.apply(this, args) || args
    const _return = fun.apply(this, _args)
    const ret = afterCall.apply(this, [_return, _args]) || _return
    return ret
  }
}

export const extractMethods = (obj, methods) => {
  const methodList = {}
  methods.forEach((method) => {
    methodList[method] = obj[method].bind(obj)
  })
  return methodList
}
