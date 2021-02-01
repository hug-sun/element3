import { RawNodeBase } from '../types'
import { Tools } from '../utils/Tools'
import { Watcher } from '../utils/Watcher'
import { TreeNode } from './TreeNode'
import { DefaultNodeKey } from '../types'
import { reactive } from 'vue'

const { createMap, reversalNodeKeyMap } = Tools

export class TreeMapper<RawNode extends RawNodeBase> {
  private _toTreeNode: WeakMap<RawNode, TreeNode>
  private _toRawNode: WeakMap<TreeNode, RawNode>
  private _toRawNodeKey: Map<string, string>
  private _toTreeNodeKey: Map<string, string>
  private _rawNodeWatcher: Watcher<RawNode>
  private _treeNodeWatcher: Watcher<TreeNode>
  private _rawNode: RawNode
  private _treeNode: TreeNode

  get rawNode(): RawNode {
    return this._rawNode
  }

  get treeNode(): TreeNode {
    return this._treeNode
  }

  get rawNodeProxy(): RawNode {
    return this._rawNodeWatcher.proxy
  }

  get treeNodeProxy(): TreeNode {
    return this._treeNodeWatcher.proxy
  }

  constructor(rawNode: RawNode, keyMap: DefaultNodeKey<RawNode>) {
    this._toTreeNode = new WeakMap()
    this._toRawNode = new WeakMap()
    this._toRawNodeKey = createMap(keyMap)
    this._toTreeNodeKey = reversalNodeKeyMap(this._toRawNodeKey)
    // init
    this._rawNode = rawNode
    this._treeNode = this.convertToTreeNode(rawNode)
    // build TreeNode

    this._rawNodeWatcher = new Watcher(this._rawNode)
    this._treeNodeWatcher = new Watcher(this._treeNode)
    this.withRawNodeHandler()
    this.withTreeNodeHandler()
    // for rawNode and treeNode reactive
  }

  convertToTreeNode(rawNode: RawNode): TreeNode {
    const treeNode = reactive(
      new TreeNode(
        rawNode[this._toRawNodeKey.get('id')],
        rawNode[this._toRawNodeKey.get('label')],
        this.convertToTreeNodes(rawNode[this._toRawNodeKey.get('children')]),
        {
          isDisabled: rawNode[this._toRawNodeKey.get('isDisabled')],
          isLeaf: rawNode[this._toRawNodeKey.get('isLeaf')]
        }
      )
    ) as TreeNode
    this._toTreeNode.set(rawNode, treeNode)
    this._toRawNode.set(treeNode, rawNode)
    return treeNode
  }

  convertToRawNode(treeNode: TreeNode): RawNode {
    const rawNode: any = {}

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
    const _treeNode = reactive(treeNode) as TreeNode
    this._toTreeNode.set(rawNode, _treeNode)
    this._toRawNode.set(_treeNode, rawNode)
    return rawNode
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
      this.forTreeNodeRemoveChild(currentTreeNode, Number(key))
    })

    this._rawNodeWatcher.bindHandler(
      'set/arr/put',
      ({ currentNode, key, value }) => {
        const currentTreeNode = this._toTreeNode.get(currentNode)
        this.forTreeNodeUpdateChild(
          currentTreeNode,
          Number(key),
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
          this._toTreeNodeKey.get(key),
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
          this._toTreeNodeKey.get(key),
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
      this.forRawNodeRemoveChild(currentRawNode, Number(key))
    })

    this._treeNodeWatcher.bindHandler(
      'set/arr/put',
      ({ currentNode, key, value }) => {
        const currentRawNode = this._toRawNode.get(currentNode)
        this.forRawNodeUpdateChild(
          currentRawNode,
          Number(key),
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
          this._toRawNodeKey.get(key),
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
          this._toRawNodeKey.get(key),
          value
        )
      }
    )
  }

  private forTreeNodeAppendChild(
    currentTreeNode: TreeNode,
    newTreeNode: TreeNode
  ): void {
    newTreeNode.parent = currentTreeNode
    currentTreeNode.children.push(newTreeNode)
  }

  private forTreeNodeUpdateValue(
    currentTreeNode: TreeNode,
    key: string,
    value: any
  ): void {
    if (key === 'children') {
      const treeNodes = this.convertToTreeNodes(value)
      treeNodes.forEach((node) => (node.parent = currentTreeNode))
      currentTreeNode[key] = treeNodes
    } else {
      currentTreeNode[key] = value
    }
  }

  private forTreeNodeRemoveChild(
    currentTreeNode: TreeNode,
    index: number
  ): void {
    // Here, the unused nodes of ToRawNode and ToTreeNode are automatically released through the WeakMap feature
    currentTreeNode.children.splice(index, 1)
  }

  private forTreeNodeUpdateChild(
    currentTreeNode: TreeNode,
    index: number,
    childNode: TreeNode
  ): void {
    childNode.parent = currentTreeNode
    currentTreeNode.children[index] = childNode
  }

  private forRawNodeAppendChild(
    currentRawNode: RawNode,
    newRawNode: RawNode
  ): void {
    currentRawNode[this._toRawNodeKey.get('children')].push(newRawNode)
  }

  private forRawNodeUpdateValue(
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

  private forRawNodeRemoveChild(currentRawNode: RawNode, index: number): void {
    // Here, the unused nodes of ToRawNode and ToTreeNode are automatically released through the WeakMap feature
    currentRawNode[this._toRawNodeKey.get('children')].splice(index, 1)
  }

  private forRawNodeUpdateChild(
    currentRawNode: RawNode,
    index: number,
    childNode: RawNode
  ): void {
    currentRawNode[this._toRawNodeKey.get('children')][index] = childNode
  }

  getRawNode(treeNode: TreeNode): RawNode {
    return this._toRawNode.get(treeNode)
  }

  getTreeNode(rawNode: RawNode): TreeNode {
    return this._toTreeNode.get(rawNode)
  }
}
