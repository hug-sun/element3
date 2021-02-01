import { isFunction } from '../../../../utils/types'

export type ID = string | number

let idSeed = 0

export type HandlerCb = (
  currentNode: TreeNode,
  parentNode: TreeNode,
  level: number
) => boolean | void

export interface TreeNodePublicProp {
  id: ID
  label: string
  children: TreeNode[]
  isChecked: boolean
  isLeaf: boolean
}

export type TK = Extract<keyof TreeNode, keyof TreeNodePublicProp>

export class TreeNode implements TreeNodePublicProp {
  id: ID
  label: string
  parent: TreeNode
  children: TreeNode[] = []
  private _isLeaf: boolean
  private _isChecked: boolean
  private _isStrictly: boolean
  private _isDisabled: boolean
  private _isExpanded: boolean
  private _isRendered = false
  private _isVisible: boolean

  get isVisible(): boolean {
    return this._isVisible
  }

  set isVisible(v: boolean) {
    this._isVisible = v
  }

  get isRendered(): boolean {
    return this._isRendered
  }

  get isExpanded(): boolean {
    return this._isExpanded
  }

  get isDisabled(): boolean {
    return this._isDisabled
  }

  set isDisabled(v: boolean) {
    this._isDisabled = v
  }

  get isStrictly(): boolean {
    if (this._isStrictly) {
      return true
    }

    return (this._isStrictly = this.parent?.isStrictly ?? false)
  }

  get isIndeterminate(): boolean {
    if (this.isStrictly) {
      return false
    }

    const checkedLen = this.getCheckedNodes().length
    if (this.isLeaf || checkedLen === 0) {
      return false
    }

    return checkedLen !== this.children.length
  }

  get isChecked(): boolean {
    if (this.isLeaf || this.isStrictly) {
      return this._isChecked
    }

    return (this._isChecked =
      this.getCheckedNodes().length === this.children.length)
  }

  get level(): number {
    return (this.parent?.level ?? -1) + 1
  }

  get isLeaf(): boolean {
    return this.children.length === 0 || this._isLeaf
  }

  set isLeaf(v: boolean) {
    this._isLeaf = v
  }

  constructor(
    id: ID,
    label: string,
    children: TreeNode[] = [],
    {
      isLeaf = false,
      isChecked = false,
      isStrictly = false,
      isDisabled = false,
      isExpanded = false,
      isVisible = true
    } = {}
  ) {
    this.id = id ?? idSeed++
    this.label = label
    this._isLeaf = isLeaf
    this._isStrictly = isStrictly
    this._isDisabled = isDisabled
    this._isExpanded = isExpanded
    this._isVisible = isVisible

    this.setChecked(isChecked)

    this.appendChild(...children)
  }

  setChecked(v = !this._isChecked) {
    if (this._isDisabled) {
      return
    }
    this.setCheckedUnlimited(v)
  }

  setCheckedUnlimited(v = !this._isChecked): void {
    this._isChecked = v
    if (!this.isStrictly) {
      this.children.forEach((node) => node.setCheckedUnlimited(v))
    }
  }

  setStrictly(v: boolean): void {
    this._isStrictly = v
  }

  getCheckedNodes(): TreeNode[] {
    return this.children.filter((node) => node.isChecked)
  }

  appendChild(...nodes: TreeNode[]) {
    nodes.forEach((node) => {
      if (!(node instanceof TreeNode)) {
        throw new Error('appendChild not TreeNode')
      }
      node.parent = this
      this.children.push(node)
    })
  }

  insertChild(index: number, ...nodes: TreeNode[]) {
    nodes.forEach((node) => {
      if (!(node instanceof TreeNode)) {
        throw new Error('insertChild not TreeNode')
      }
      node.parent = this
    })
    this.children.splice(index, 0, ...nodes)
  }

  removeChild(index: number, num = 1) {
    this.children.splice(index, num)
  }

  findOne(target: ID | TreeNode | HandlerCb): TreeNode {
    let result
    this.depthEach((currentNode) => {
      if (
        target === currentNode.id ||
        target === currentNode ||
        (typeof target === 'function' &&
          target(currentNode, currentNode.parent, currentNode.level))
      ) {
        result = currentNode
        return true
      }
    })
    return result
  }

  findMany(target: string | HandlerCb) {
    const result = []
    this.depthEach((currentNode) => {
      if (
        (typeof target === 'string' && currentNode.label.includes(target)) ||
        (typeof target === 'function' &&
          target(currentNode, currentNode.parent, currentNode.level))
      ) {
        result.push(currentNode)
      }
    })
    return result
  }

  findChild(id: ID | TreeNode): TreeNode {
    return this.children.find((node) => node.id === id || node === id)
  }

  /**
   * Traverse upward
   */
  upwardEach(callback: HandlerCb, { isSkipSelf = true } = {}): void {
    let current = isSkipSelf ? this.parent : this
    while (current) {
      if (callback(current, current.parent, current.level)) {
        return
      }
      current = current.parent
    }
  }

  /**
   * from current node start, down each
   */
  depthEach(upToDownCallBack: HandlerCb, downToUpCallBack?: HandlerCb): void {
    const dfs = (node, deep) => {
      for (let i = 0; i < node.children.length; i++) {
        const _node = node.children[i]
        if (isFunction(upToDownCallBack) && upToDownCallBack(_node, node, deep))
          return
        dfs(_node, deep + 1)
        if (isFunction(downToUpCallBack) && downToUpCallBack(node, _node, deep))
          return
      }
    }
    isFunction(upToDownCallBack) && upToDownCallBack(this, this.parent, 0)
    dfs(this, 1)
    isFunction(downToUpCallBack) && downToUpCallBack(this, this.parent, 0)
  }

  expand(v = !this._isExpanded, isAutoExpandParent = false): void {
    this._isExpanded = v
    if (v) {
      this._isRendered = true
    }
    if (isAutoExpandParent) {
      this.parent?.expand(true, true)
    }
  }

  collapse(v = !this._isExpanded): void {
    const parent = this.parent
    if (!parent) {
      return
    }
    parent.children.forEach((node) => node.expand(false))
    this.expand(v)
  }

  show() {
    this._isVisible = true
    this.parent?.show()
  }
  hide() {
    this._isVisible = false
  }
}
