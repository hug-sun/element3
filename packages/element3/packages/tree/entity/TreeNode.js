/* eslint-disable @typescript-eslint/no-this-alias */
const typeFlag = Symbol('TREE_NODE')

/**
 *
 * @param {*} id
 * @param {string} label
 * @param {TreeNode[]} childNodes
 * @param {object} param3
 */
export class TreeNode {
  constructor(
    id,
    label,
    childNodes = [],
    {
      /* 默认值 */
      parent = null,
      isAsync = false,
      isVisable = true,
      isChecked = false,
      isIndeterminate = false,
      isExpanded = false,
      isDisabled = false,
      isDraggable = false,
      isLeaf = false,
      data = {},
      asyncLoadFn = () => null
    } = {},
    {
      /* 拦截函数 */
      insertChild = null,
      appendChild = null,
      removeChild = null
    } = {}
  ) {
    this.id = id || label
    this.label = label
    this.parent = parent
    this.childNodes = childNodes
    this.isVisable = isVisable
    this.isChecked = isChecked
    this.isIndeterminate = isIndeterminate
    this.isExpanded = isExpanded
    this.isDisabled = isDisabled
    this.isDraggable = isDraggable
    this.isRendered = false
    this.data = data // Additional data carried by the node
    this.isLeaf = isLeaf

    this.isAsync = isAsync // Load child only at expand time
    this.asyncState = 'notload' // notload || loaded || loading
    this.asyncLoadFn = asyncLoadFn // (currentNode, resolveFn) async load child node

    this.interceptHandler = {
      insertChild,
      appendChild,
      removeChild
    }

    // this.cache = {
    //   level: null
    // }
    // not use, You can cache read-only properties here

    this.updateChildParent()
    this.updateChildChecked()
    this.updateCheckedState()
    this.updateExpandedState()
  }

  get root() {
    // readonly
    let root = this
    this.upwardEach((node) => {
      root = node
    })
    return root
  }

  get isLeaf() {
    return this.isAsync
      ? this.asyncState === 'loaded' && this.childNodes.length === 0
      : this.childNodes.length === 0
  }

  set isLeaf(v) {
    if (v) this.asyncState = 'loaded'
  }

  get isRoot() {
    // readonly
    return this.root === this
  }

  get level() {
    // readonly
    if (!this.parent) return 0
    return this.parent.level + 1
  }

  get type() {
    // readonly
    return typeFlag
  }

  get index() {
    // readonly
    const parent = this.parent
    if (!parent) return -1
    return parent.findChildIndex(this)
  }

  get checkedNodes() {
    return this.childNodes.filter(
      (treeNode) => treeNode.isChecked && !treeNode.isIndeterminate
    )
  }

  loadAsync() {
    if (!this.isAsync || this.asyncState !== 'notload') {
      return
    }
    const resolveFn = (childNodes = []) => {
      // this.childNodes = []
      this.append(...childNodes)
      this.asyncState = 'loaded'
    }
    this.asyncState = 'loading'
    this.asyncLoadFn(this, resolveFn)
  }

  updateChildParent() {
    this.childNodes.forEach((node) => {
      node.parent = this
    })
  }

  updateChildChecked() {
    if (this.isChecked) {
      this.setChildChecked(true)
    }
  }

  updateCheckedState() {
    if (this.isLeaf) {
      return
    }
    // not leaf node exec
    const checkedNodeLen = this.getCheckedNode().length
    const childrenNodeLen = this.childNodes.length
    if (childrenNodeLen === 0) {
      return
    }
    if (checkedNodeLen === childrenNodeLen) {
      // full select
      this.setCheckedState(1)
    } else if (checkedNodeLen === 0) {
      // not full select
      this.setCheckedState(0)
    } else {
      // Half select
      this.setCheckedState(2)
    }
  }

  updateExpandedState() {
    const childNodes = this.childNodes
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i]
      if (node.isExpanded) {
        this.isExpanded = true
        return
      }
    }
  }

  /**
   *
   * @param {TreeNode} node
   */
  appendChild(node) {
    if (this.interceptHandler.appendChild) {
      const [_node] = this.interceptHandler.appendChild.apply(this, arguments)
      if (typeof _node !== 'undefined') node = _node
    }
    if (!TreeNode.isType(node)) {
      return false
    }
    node.parent = this
    if (this.isChecked) {
      node.setChecked(true)
    }
    this.childNodes.push(node)
    return true
  }

  append(...nodes) {
    nodes.forEach((node) => {
      this.appendChild(node)
    })
    return true
  }

  /**
   *
   * @param {number} index
   * @param {TreeNode} node
   */
  insertChild(index, node) {
    if (this.interceptHandler.appendChild) {
      const [_index, _node] = this.interceptHandler.insertChild.apply(
        this,
        arguments
      )
      if (typeof _index !== 'undefined') index = _index
      if (typeof _node !== 'undefined') node = _node
    }
    if (!TreeNode.isType(node)) {
      return false
    }
    if (this.isChecked) {
      node.setChecked(true)
    }
    node.parent = this
    this.childNodes.splice(index, 0, node)
    return true
  }

  insert() {
    this.insertChild.apply(this, arguments)
  }

  /**
   *
   * @param {number} index
   */
  removeChild(index) {
    if (this.interceptHandler.appendChild) {
      this.interceptHandler.removeChild.apply(this, arguments)
    }
    if (index < 0 || index >= this.childNodes.length) {
      return false
    }
    this.childNodes.splice(index, 1)
    return true
  }

  remove() {
    if (!this.parent) {
      return false
    }
    return this.parent.removeChild(this.index)
  }

  /**
   *
   * @param {boolean} value
   */
  setChecked(value, strictly = false) {
    this.isIndeterminate = false
    let _value = !this.isChecked
    if (typeof value !== 'undefined') {
      _value = value
    }

    this.isChecked = _value
    if (!strictly) {
      this.upwardEach((node) => {
        if (!node.isDisabled) this.updateCheckedState.call(node)
      })
      this.depthEach((node) => {
        if (!node.isDisabled && node.isVisable) node.isChecked = _value
      })
    }

    return this.isChecked
  }

  setChildChecked(value) {
    this.childNodes.forEach((node) => (node.isChecked = value))
  }

  /**
   * Traverse upward
   * @param {Function} callback( node:TreeNode ) if returns true then stop each, else not stop
   */
  upwardEach(callback, { isSkipSelf = true } = {}) {
    let current = isSkipSelf ? this.parent : this
    while (current) {
      if (callback(current)) {
        return
      }
      current = current.parent
    }
  }

  /**
   * from current node start, down each
   * @param {Function} callback( node:TreeNode, parentNode:TreeNode, deep: number) if returns true then stop each, else not stop
   */
  depthEach(upToDownCallBack = () => false, downToUpCallBack = () => false) {
    const dfs = (node, deep) => {
      if (!TreeNode.isType(node)) {
        return
      }
      for (let i = 0; i < node.childNodes.length; i++) {
        const _node = node.childNodes[i]
        if (upToDownCallBack(_node, node, deep)) return
        dfs(_node, deep + 1)
        if (downToUpCallBack(_node, node, deep)) return
      }
    }
    upToDownCallBack(this, this.parent, 0)
    dfs(this, 1)
    downToUpCallBack(this, this.parent, 0)
  }

  getCheckedNode() {
    return this.childNodes.filter((item) => item.isChecked)
  }

  /**
   *
   * @param {number} state 0:not checked, 1:checked, 2:indeterminate
   */
  setCheckedState(state) {
    const eunmState = [
      { isChecked: false, isIndeterminate: false },
      { isChecked: true, isIndeterminate: false },
      { isChecked: true, isIndeterminate: true }
    ]
    if (!eunmState[state]) {
      return false
    }

    this.isChecked = eunmState[state].isChecked
    this.isIndeterminate = eunmState[state].isIndeterminate
    return true
  }

  /**
   * Look for node in the subtree
   * @param {ID|TreeNode} target
   */
  findOne(target) {
    let res = null
    this.depthEach((node) => {
      if (node.id == target || node === target) {
        res = node
        return true
      }
    })
    return res
  }

  /**
   * find nodes
   * @param {Function | string} target
   */
  findMany(target) {
    const res = []
    this.depthEach((node, parent, deep) => {
      if (
        (typeof target === 'function' && target(node, parent, deep)) ||
        (typeof target === 'string' && node.label.search(target) !== -1)
      ) {
        res.push(node)
      }
    })
    return res
  }

  findChildIndex(target) {
    for (let i = 0; i < this.childNodes.length; i++) {
      const node = this.childNodes[i]
      if (node.id == target || node === target) {
        return i
      }
    }
    return -1
  }

  expand(value, ...extraNodes) {
    let _value = this.isExpanded
    _value = typeof value === 'undefined' ? !_value : value
    this.isExpanded = _value
    this.upwardEach((node) => {
      node.expand(true)
    })

    this.loadAsync()
    this.append(...extraNodes)
    this.isRendered = true
  }

  filter(callback = () => true) {
    const arr = []
    this.setSubTreeVisable(false)
    this.depthEach((node, parentNode, deep) => {
      const isShow = callback(node, parentNode, deep)
      if (isShow) {
        node.setVsiable(true)
        arr.push(node)
      }
    })
    return arr
  }

  setSubTreeVisable(value) {
    this.depthEach((node) => {
      node.isVisable = value
    })
  }

  setVsiable(value) {
    this.isVisable = value
    this.upwardEach((node) => {
      node.isVisable = true
    })
  }

  separation() {
    const parent = this.parent
    if (!parent) return null
    parent.removeChild(this.index)
    this.parent = null
    return this
  }

  /**
   * is allow move to target
   * @param {TreeNode} target
   * @param {string} relative top, bottom, inner
   */
  isAllowMove(target) {
    if (target === this) {
      return false
    }

    if (this.findOne(target)) {
      return false
    }

    return true
  }

  /**
   * currentNode move to targetNode relative location
   * @param {TreeNode} target
   * @param {string} relative top, bottom, inner
   */
  move(target, relative) {
    if (!this.isAllowMove(target, relative)) {
      return false
    }

    this.separation()

    switch (relative) {
      case 'top': // top
        target.parent.insertChild(target.index, this)
        return true
      case 'inner': // inner
        target.expand(true, this)
        return true
      case 'bottom': // bottom
        target.parent.insertChild(target.index + 1, this)
        return true
    }
  }

  collapse() {
    const parent = this.parent
    if (!parent) {
      return
    }

    parent.childNodes.forEach((node) => {
      if (node === this) {
        node.expand()
      } else {
        node.expand(false)
      }
    })
  }

  static isType(node) {
    if (typeof node !== 'object') {
      return false
    }

    return node.type === typeFlag
  }

  static create({ id, label, childNodes, interceptHandler, ...otherParams }) {
    return new TreeNode(id, label, childNodes, otherParams, interceptHandler)
  }
}
