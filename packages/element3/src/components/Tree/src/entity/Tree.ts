import { DefaultNodeKey, RawNodeBase } from '../types'
import { TreeNode } from './TreeNode'
import { TreeMapper } from './TreeMapper'

export class Tree<RawNode extends RawNodeBase> {
  private _root: TreeNode
  private _mapper: TreeMapper<RawNode>
  private _rawRoot: RawNode

  get root(): TreeNode {
    return this._root
  }

  get rawRoot(): RawNode {
    return this._rawRoot
  }

  get isEmpty() {
    return this._root.children.length === 0
  }

  constructor(rawNodes: RawNode[], defaultNodeKey: DefaultNodeKey<RawNode>) {
    const _defaultNodeKey = Object.assign(
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
        [_defaultNodeKey.children]: rawNodes
      } as RawNode,
      defaultNodeKey
    )

    this._root = this._mapper.getTreeNodeProxy()
    this._rawRoot = this._mapper.getRawNodeProxy()
  }
}
