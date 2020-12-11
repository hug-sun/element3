import { TreeNode } from './TreeNode'
import { nodeMap, nodeEach, transitionObjectKey } from '../libs/util'
import { createAction } from './Action'

export class Tree {
  /**
   *
   * @param {object[]} list
   * @param {object} defaultNodeKey The incoming Node proprtry name maps to the default name
   */
  constructor(list, defaultNodeKey = {}, defaultNodeValue = {}) {
    this.isUpdateRaw = true
    this.raw = list
    this.injectAction = createAction(this) // The core method is injected with interceptor functions, the insert RowNode is automatically converted to TreeNode
    this.root = new TreeNode(
      Date.now(),
      'root',
      [],
      defaultNodeValue,
      this.injectAction
    )
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
    // this.checked = []
    // this.expanded = []
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

  get checked() {
    const t = {}
    this.root.depthEach((node) => {
      node.isChecked && !node.isIndeterminate && (t[node.id] = true)
    })
    return Object.keys(t)
  }

  set checked(v) {
    this.setCheckedByIdList(v)
  }

  get expanded() {
    const t = {}
    this.root.depthEach((node) => {
      node.isExpanded && (t[node.id] = true)
    })
    return Object.keys(t)
  }

  set expanded(v) {
    this.setExpandedByIdList(v, true)
  }

  initRoot() {
    // rekeyname and create TreeNode
    this.isUpdateRaw = false
    this.root.childNodes = []
    this.root.append(...this.raw)
    this.isUpdateRaw = true
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
            { data: { raw: node }, interceptHandler: this.injectAction },
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
    this.root.setChecked(true)
  }

  expandAll() {
    this.root.depthEach((node) => {
      if (node.isLeaf) {
        node.expand(true)
      }
    })
  }

  setCheckedByIdList(idList = []) {
    console.log(idList.toString())
    this.root.depthEach((node) => {
      if (node === this.root) {
        return
      }
      if (idList.indexOf(node.id) !== -1) {
        node.isChecked = true
      } else {
        // node.isChecked = false
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
