import { TreeNode } from '../../src/entity/TreeNode'

describe('TreeNode.ts', () => {
  it('init a tree', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node2'),
      new TreeNode(3, 'Node3')
    ])

    expect(treeNode.id).toEqual(1)
    expect(treeNode.label).toEqual('Node1')

    expect(treeNode.children[0].id).toEqual(2)
    expect(treeNode.children[0].label).toEqual('Node2')

    expect(treeNode.children[1].id).toEqual(3)
    expect(treeNode.children[1].label).toEqual('Node3')
  })

  it('test level depth', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node2'),
      new TreeNode(3, 'Node3')
    ])

    expect(treeNode.level).toEqual(0)
    expect(treeNode.children[0].level).toEqual(1)
    expect(treeNode.children[1].level).toEqual(1)
  })

  it('when node children is null then isLeaf with true', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node2'),
      new TreeNode(3, 'Node3')
    ])

    expect(treeNode.isLeaf).toBeFalsy()
    expect(treeNode.children[0].isLeaf).toBeTruthy()
    expect(treeNode.children[1].isLeaf).toBeTruthy()
  })

  it('test appendChild method', () => {
    const treeNode = new TreeNode(1, 'Node1', [])
    treeNode.appendChild(new TreeNode(2, 'Node2'), new TreeNode(3, 'Node3'))

    expect(treeNode.children).toHaveLength(2)
    expect(treeNode.children[0].id).toEqual(2)
    expect(treeNode.children[1].id).toEqual(3)
  })

  it('test insertChild method', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(11, 'Node2'),
      new TreeNode(12, 'Node2')
    ])
    treeNode.insertChild(1, new TreeNode(2, 'Node2'), new TreeNode(3, 'Node3'))

    expect(treeNode.children).toHaveLength(4)
    expect(treeNode.children[1].id).toEqual(2)
    expect(treeNode.children[2].id).toEqual(3)
  })

  it('test removeChild method', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(11, 'Node2'),
      new TreeNode(12, 'Node2')
    ])

    treeNode.removeChild(1)

    expect(treeNode.children).toHaveLength(1)
    expect(treeNode.children[0].id).toEqual(11)
  })
})
