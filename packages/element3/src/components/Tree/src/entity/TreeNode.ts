export type ID = string | number

let idSeed = 0

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
  isChecked = false
  private _isLeaf = false

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
    this.isChecked = isChecked

    this.appendChild(...children)
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
}
