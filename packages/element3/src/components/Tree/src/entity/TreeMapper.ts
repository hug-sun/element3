import { UnknownObject } from '../types'
import { Tools } from '../utils/Tools'
import { Watcher } from '../utils/Watcher'
import { TK, TreeNode } from './TreeNode'

export class TreeMapper<
  RawNode extends UnknownObject,
  RK extends keyof RawNode
> {
  private _toTreeNode: Map<RawNode, TreeNode>
  private _toRawNode: Map<TreeNode, RawNode>
  private _toRawNodeKey: Map<TK, string>
  private _toTreeNodeKey: Map<RK, TK>
  private _rawNodeWatcher: Watcher<RawNode>
  private _treeNodeWatcher: Watcher<TreeNode>
  rawNode: RawNode
  treeNode: TreeNode

  constructor(rawNode: RawNode, keyMap) {
    this._toTreeNode = new Map()
    this._toRawNode = new Map()
    this._toRawNodeKey = Tools.createMap(keyMap)
    this._toTreeNodeKey = Tools.reversalNodeKeyMap(this._toRawNodeKey)
    // init

    this.rawNode = rawNode
    this.treeNode = this.convertToTreeNode(rawNode)
    // build TreeNode

    this._rawNodeWatcher = new Watcher(this.rawNode)
    this._treeNodeWatcher = new Watcher(this.treeNode)
    this.withRawNodeHandler()
    this.withTreeNodeHandler()
    // for rawNode and treeNode reactive
  }

  getRawNodeProxy(): RawNode {
    return this._rawNodeWatcher.getProxy()
  }

  getTreeNodeProxy(): TreeNode {
    return this._treeNodeWatcher.getProxy()
  }

  convertToTreeNode(rawNode: RawNode): TreeNode {
    const treeNode = new TreeNode(
      rawNode[this._toRawNodeKey.get('id')] as number,
      rawNode[this._toRawNodeKey.get('label')] as string,
      this.convertToTreeNodes(
        rawNode[this._toRawNodeKey.get('children')] as RawNode[]
      ),
      {
        isChecked: rawNode[this._toRawNodeKey.get('isChecked')] as boolean,
        isLeaf: rawNode[this._toRawNodeKey.get('isLeaf')] as boolean
      }
    )
    this._toTreeNode.set(rawNode, treeNode)
    this._toRawNode.set(treeNode, rawNode)
    return treeNode
  }

  convertToRawNode(treeNode: TreeNode): RawNode {
    const rawNode = {}

    if (this._toRawNodeKey.get('id')) {
      rawNode[this._toRawNodeKey.get('id')] = treeNode.id
    }
    if (this._toRawNodeKey.get('label')) {
      rawNode[this._toRawNodeKey.get('label')] = treeNode.label
    }
    if (this._toRawNodeKey.get('children')) {
      rawNode[this._toRawNodeKey.get('children')] = this.convertToRawNodes(
        treeNode.children
      )
    }

    this._toTreeNode.set(rawNode as RawNode, treeNode)
    this._toRawNode.set(treeNode, rawNode as RawNode)
    return rawNode as RawNode
  }

  convertToTreeNodes(rawNodes: RawNode[]): TreeNode[] {
    return rawNodes?.map((node: RawNode) => this.convertToTreeNode(node))
  }

  convertToRawNodes(treeNodes: TreeNode[]): RawNode[] {
    return treeNodes?.map((node: TreeNode) => this.convertToRawNode(node))
  }

  private withRawNodeHandler(): void {
    this._rawNodeWatcher.bindHandler(
      'set/arr/add',
      ({ currentNode, value }) => {
        const currentTreeNode = this._toTreeNode.get(currentNode)
        this.forTreeNodeAppendChild(
          currentTreeNode,
          this.convertToTreeNode(value)
        )
      }
    )

    this._rawNodeWatcher.bindHandler('set/arr/del', ({ currentNode, key }) => {
      const currentTreeNode = this._toTreeNode.get(currentNode)
      this.forTreeNodeRemoveChild(currentTreeNode, key as number)
    })

    this._rawNodeWatcher.bindHandler(
      'set/arr/put',
      ({ currentNode, key, value }) => {
        const currentTreeNode = this._toTreeNode.get(currentNode)
        this.forTreeNodeUpdateChild(
          currentTreeNode,
          key as number,
          this._toTreeNode.get(value) ?? this.convertToTreeNode(value)
        )
      }
    )

    this._rawNodeWatcher.bindHandler(
      'set/obj/put',
      ({ currentNode, key, value }) => {
        const currentTreeNode = this._toTreeNode.get(currentNode)
        this.forTreeNodeUpdateValue(
          currentTreeNode,
          this._toTreeNodeKey.get(key as RK),
          value
        )
      }
    )

    this._rawNodeWatcher.bindHandler(
      'set/obj/add',
      ({ currentNode, key, value }) => {
        const currentTreeNode = this._toTreeNode.get(currentNode)
        this.forTreeNodeUpdateValue(
          currentTreeNode,
          this._toTreeNodeKey.get(key as RK),
          value
        )
      }
    )
  }

  private withTreeNodeHandler(): void {
    this._treeNodeWatcher.bindHandler(
      'set/arr/add',
      ({ currentNode, value }) => {
        const currentRawNode = this._toRawNode.get(currentNode)
        this.forRawNodeAppendChild(currentRawNode, this.convertToRawNode(value))
      }
    )

    this._treeNodeWatcher.bindHandler('set/arr/del', ({ currentNode, key }) => {
      const currentRawNode = this._toRawNode.get(currentNode)
      this.forRawNodeRemoveChild(currentRawNode, key as number)
    })

    this._treeNodeWatcher.bindHandler(
      'set/arr/put',
      ({ currentNode, key, value }) => {
        const currentRawNode = this._toRawNode.get(currentNode)
        this.forRawNodeUpdateChild(
          currentRawNode,
          key as number,
          this.convertToRawNode(value)
        )
      }
    )

    this._treeNodeWatcher.bindHandler(
      'set/obj/put',
      ({ currentNode, key, value }) => {
        const currentRawNode = this._toRawNode.get(currentNode)
        this.forRawNodeUpdateValue(
          currentRawNode,
          this._toRawNodeKey.get(key as TK),
          value
        )
      }
    )

    this._treeNodeWatcher.bindHandler(
      'set/obj/add',
      ({ currentNode, key, value }) => {
        const currentRawNode = this._toRawNode.get(currentNode)
        this.forRawNodeUpdateValue(
          currentRawNode,
          this._toRawNodeKey.get(key as TK),
          value
        )
      }
    )
  }

  forTreeNodeAppendChild(
    currentTreeNode: TreeNode,
    newTreeNode: TreeNode
  ): void {
    currentTreeNode.children.push(newTreeNode)
  }

  forTreeNodeUpdateValue(
    currentTreeNode: TreeNode,
    key: string,
    value: any
  ): void {
    if (key === 'children') {
      currentTreeNode[key] = this.convertToTreeNodes(value)
    } else {
      currentTreeNode[key] = value
    }
  }

  forTreeNodeRemoveChild(currentTreeNode: TreeNode, index: number): void {
    // TODO: 这里还得对toRawNode 与 toTreeNode 进行处理，不然会内存泄漏
    currentTreeNode.children.splice(index, 1)
  }

  forTreeNodeUpdateChild(
    currentTreeNode: TreeNode,
    index: number,
    childNode: TreeNode
  ): void {
    currentTreeNode.children[index] = childNode
  }

  forRawNodeAppendChild(currentRawNode: RawNode, newRawNode: RawNode): void {
    currentRawNode[this._toRawNodeKey.get('children')].push(newRawNode)
  }

  forRawNodeUpdateValue(
    currentRawNode: RawNode,
    key: string,
    value: any
  ): void {
    if (key === this._toRawNodeKey.get('children')) {
      Reflect.set(currentRawNode, key, this.convertToRawNodes(value))
    } else if (Reflect.has(currentRawNode, key)) {
      Reflect.set(currentRawNode, key, value)
    }
  }

  forRawNodeRemoveChild(currentRawNode: RawNode, index: number): void {
    // TODO: 这里还得对toRawNode 与 toTreeNode 进行处理，不然会内存泄漏
    currentRawNode[this._toRawNodeKey.get('children')].splice(index, 1)
  }

  forRawNodeUpdateChild(
    currentRawNode: RawNode,
    index: number,
    childNode: RawNode
  ): void {
    currentRawNode[this._toRawNodeKey.get('children')][index] = childNode
  }
}
