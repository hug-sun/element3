import { isFunction } from '../../../../utils/types'

export type ID = string | number

let idSeed = 0

// export enum CheckboxState {
//   NONE = 0,
//   CHECKED = 1,
//   INDETERMINATE = 2
// }

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
  private _isLeaf = false
  private _isChecked = false

  get isIndeterminate(): boolean {
    const checkedLen = this.getCheckedNodes().length
    if (this.isLeaf || checkedLen === 0) {
      return false
    }

    return this.getCheckedNodes().length !== this.children.length
  }

  get isChecked(): boolean {
    if (this.isLeaf) {
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
    { isLeaf = false, isChecked = false } = {}
  ) {
    this.id = id ?? idSeed++
    this.label = label
    this._isLeaf = isLeaf
    this.setChecked(isChecked)

    this.appendChild(...children)
  }

  setChecked(v = !this._isChecked): void {
    this._isChecked = v
    this.children.forEach((node) => node.setChecked(v))
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

  findOne(id: ID | TreeNode): TreeNode {
    let node
    this.depthEach((currentNode) => {
      if (id === currentNode.id || id === currentNode) {
        node = currentNode
      }
    })
    return node
  }

  findChild(id: ID | TreeNode): TreeNode {
    return this.children.find((node) => node.id === id || node === id)
  }

  /**
   * Traverse upward
   */
  upwardEach(
    callback: (node: TreeNode) => boolean,
    { isSkipSelf = true } = {}
  ): void {
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
   */
  depthEach(
    upToDownCallBack: (
      currentNode: TreeNode,
      parentNode?: TreeNode,
      deep?: number
    ) => boolean | void,
    downToUpCallBack?: (
      currentNode: TreeNode,
      parentNode?: TreeNode,
      deep?: number
    ) => boolean | void
  ): void {
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
}
