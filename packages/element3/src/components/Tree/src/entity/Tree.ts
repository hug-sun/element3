import { DefaultNodeKey, RawNodeBase } from '../types'
import { ID, TreeNode } from './TreeNode'
import { TreeMapper } from './TreeMapper'

export class Tree<RawNode extends RawNodeBase> {
  private _mapper: TreeMapper<RawNode>
  private _defaultNodeKey: DefaultNodeKey<RawNode>

  get root(): TreeNode {
    return this._mapper.treeNode
  }

  get rootProxy(): TreeNode {
    return this._mapper.treeNodeProxy
  }

  get rawRootProxy(): RawNode {
    return this._mapper.rawNodeProxy
  }

  get rawNodesProxy(): RawNode[] {
    return this.rawRootProxy[this._defaultNodeKey.children]
  }

  get isEmpty() {
    return this.root.children.length === 0
  }

  constructor(rawNodes: RawNode[], defaultNodeKey: DefaultNodeKey<RawNode>) {
    this._defaultNodeKey = Object.assign(
      {
        id: 'id',
        label: 'label',
        children: 'children',
        isDisabled: 'isDisabled',
        isAsync: 'isAsync',
        isChecked: 'isChecked',
        isVisible: 'isVisible',
        isExpanded: 'isExpanded',
        isLeaf: 'isLeaf'
      },
      defaultNodeKey
    )

    this._mapper = new TreeMapper<RawNode>(
      {
        [this._defaultNodeKey.label]: 'ROOT',
        [this._defaultNodeKey.children]: rawNodes
      } as RawNode,
      this._defaultNodeKey
    )
  }

  setCheckedByIds(ids: ID[]): void {
    this.rootProxy.depthEach((currentNode: TreeNode) => {
      if (ids.includes(currentNode.id)) {
        currentNode.setChecked(true)
      }
    })
  }

  getCheckedIds(): ID[] {
    const ids = []
    this.rootProxy.depthEach((currentNode: TreeNode) => {
      if (currentNode !== this.rootProxy && currentNode.isChecked) {
        ids.push(currentNode.id)
      }
    })

    return ids
  }
}
