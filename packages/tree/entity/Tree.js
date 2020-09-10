import { TreeNode } from './TreeNode'
import {
  nodeMap,
  nodeEach,
  transitionObjectKey,
  methodInterceptor
} from '../libs/util'

const rootId = Symbol('root')

export class Tree {
  /**
   *
   * @param {object[]} list
   * @param {object} defaultNodeKey The incoming Node proprtry name maps to the default name
   */
  constructor(list, defaultNodeKey = {}, defaultNodeValue = {}) {
    this.isUpdateRaw = true
    this.raw = list
    this.root = new TreeNode(rootId, null)
    this.defaultNodeKey = Object.assign(
      {
        id: 'id',
        label: 'label',
        childNodes: 'childNodes',
        isDisabled: 'isDisabled',
        isAsync: 'isAsync',
        isChecked: 'isChecked',
        isVisable: 'isVisable',
        isExpanded: 'isExpanded'
      },
      defaultNodeKey
    )
    this.defaultNodeValue = Object.assign({}, defaultNodeValue)
    this.injectRawAction() // The core method is injected with interceptor functions, the insert RowNode is automatically converted to TreeNode
    this.initRoot()
  }

  get isEmpty() {
    for (let i = 0; i < this.root.childNodes.length; i++) {
      const node = this.root.childNodes[i]
      if (node.isVisable) {
        return false
      }
    }
    return true
  }

  initRoot() {
    // rekeyname and create TreeNode
    this.isUpdateRaw = false
    this.root.childNodes = []
    this.root.append(...this.raw)
    this.isUpdateRaw = true
  }

  injectRawAction() {
    // this.root changed update this.raw
    const that = this
    methodInterceptor(TreeNode, 'appendChild', function (rawNode) {
      if (TreeNode.isType(rawNode)) {
        that.appendRawNode(this, rawNode.data.raw)
        return [rawNode]
      }
      that.appendRawNode(this, rawNode)
      return [that.rawNodeToTreeNode(rawNode)]
    })

    methodInterceptor(TreeNode, 'removeChild', function (index) {
      that.removeChildRawNode(this, index)
    })

    methodInterceptor(TreeNode, 'insertChild', function (index, rawNode) {
      if (TreeNode.isType(rawNode)) {
        that.insertRawNode(this, index, rawNode.data.raw)
        return [index, rawNode]
      }
      that.insertRawNode(this, index, rawNode)
      return [index, that.rawNodeToTreeNode(rawNode)]
    })
  }

  rawNodeToTreeNode(rawNode) {
    const { childNodes } = this.defaultNodeKey
    return nodeMap(
      rawNode,
      (_node, node) => {
        const handledNode = transitionObjectKey(_node, this.defaultNodeKey)
        // debugger
        const treeNode = TreeNode.create(
          Object.assign(
            {},
            this.defaultNodeValue,
            { data: { raw: node } },
            handledNode,
            { childNodes: [] }
          )
        )
        return treeNode
      },
      { childKey: childNodes, mapChildKey: 'childNodes' }
    )
  }

  update() {
    // rebuild tree
    // TODO: 这里可以做diff优化
    this.initRoot()
  }

  removeChildRawNode(target, index) {
    const { childNodes } = this.defaultNodeKey
    if (!this.isUpdateRaw) {
      return
    }
    let rawChild = target.data.raw ? target.data.raw[childNodes] : this.raw
    if (!rawChild) {
      target.data.raw[childNodes] = []
      rawChild = target.data.raw[childNodes]
    }
    rawChild.splice(index, 1)
  }

  appendRawNode(target, rawNode) {
    const { childNodes } = this.defaultNodeKey
    if (!this.isUpdateRaw) {
      return
    }
    let rawChild = target.data.raw ? target.data.raw[childNodes] : this.raw
    if (!rawChild) {
      target.data.raw[childNodes] = []
      rawChild = target.data.raw[childNodes]
    }
    rawChild.push(rawNode)
  }

  insertRawNode(target, index, rawNode) {
    const { childNodes } = this.defaultNodeKey
    if (!this.isUpdateRaw) {
      return
    }
    let rawChild = target.data.raw ? target.data.raw[childNodes] : this.raw
    if (!rawChild) {
      target.data.raw[childNodes] = []
      rawChild = target.data.raw[childNodes]
    }
    rawChild.splice(index, 0, rawNode)
  }

  getParentRawNode(rawNode) {
    let parentNode = null
    const { childNodes } = this.defaultNodeKey
    nodeEach(
      { [childNodes]: this.raw },
      (current, parent) => {
        if (current === rawNode || current.id === rawNode.id) {
          parentNode = parent
          return true
        }
      },
      { childKey: childNodes }
    )
    return parentNode
  }

  showAll() {
    this.root.setSubTreeVisable(true)
  }

  checkedAll() {
    this.root.setChecked()
  }

  expandAll() {
    this.root.expand(true)
  }

  setCheckedByIdList(idList = [], value = true) {
    this.root.depthEach((node) => {
      if (idList.indexOf(node.id) !== -1) {
        node.setChecked(value)
      }
    })
  }

  setExpandedByIdList(idList = [], value = true) {
    this.root.depthEach((node) => {
      if (idList.indexOf(node.id) !== -1) {
        node.expand(value)
      }
    })
  }
}
