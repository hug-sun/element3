import { TreeNode } from './TreeNode'

export function createAction(tree) {
  // this.root changed update this.raw
  const appendChild = function (node) {
    if (TreeNode.isType(node)) {
      tree.appendRawNode(this, node.data.raw) // 这里的this表示当前的TreeNode
      return [node]
    }
    tree.appendRawNode(this, node)
    return [tree.rawNodeToTreeNode(node)]
  }
  const removeChild = function (index) {
    tree.removeChildRawNode(this, index) // 这里的this表示当前的TreeNode
  }
  const insertChild = function (index, node) {
    if (TreeNode.isType(node)) {
      tree.insertRawNode(this, index, node.data.raw) // 这里的this表示当前的TreeNode
      return [index, node]
    }
    tree.insertRawNode(this, index, node)
    return [index, tree.rawNodeToTreeNode(node)]
  }
  return { appendChild, removeChild, insertChild }
}
